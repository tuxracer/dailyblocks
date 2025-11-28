import { stringify } from "qs";
import { chain, get } from "lodash";
import { RedditPost } from "../models/RedditPost";
import { URLS } from "../consts";
import { RedditComment } from "../models/RedditComment";

export const stripSpecialChars = (str?: string | null) =>
    str ? str.replace(/[^a-z0-9]/gi, "") : "";

export const sanitizeStr = (str?: string | null, maxLength = 1024) =>
    str ? stripSpecialChars(str).slice(0, maxLength) : undefined;

export const fetchUrl = async (
    url: string,
    method?: "POST" | "GET" | "PUT" | "DELETE",
) => {
    const resp = await fetch(url, { method, cache: "no-cache" });
    const json: any = await resp.json();
    return json;
};

export const fetchRedditPath = async (
    pathname: string,
    params?: { [id: string]: any },
) => {
    const path = pathname.startsWith("/") ? pathname : "/" + pathname;
    const defaultParams = { raw_json: 1 };
    const allParams = { ...defaultParams, ...params };
    const paramsAppend = params ? "?" + stringify(allParams) : "";
    const url = URLS.REDDIT + path + ".json" + paramsAppend;
    const resp = await fetchUrl(url);
    return resp;
};

export type SortTime = "recent" | "month" | "year" | "all";

export type SortBy = "top" | "hot";

export interface GetPostsBySubredditOptions {
    subreddit?: string;
    sortBy?: SortBy;
    sortTime?: SortTime;
}

const defaultGetPostsBySubredditOptions: GetPostsBySubredditOptions = {
    subreddit: "videos",
    sortBy: "hot",
    sortTime: "recent",
};

export const getPostsBySubreddit = async ({
    subreddit = defaultGetPostsBySubredditOptions.subreddit,
    sortBy = defaultGetPostsBySubredditOptions.sortBy,
    sortTime = defaultGetPostsBySubredditOptions.sortTime,
}: GetPostsBySubredditOptions) => {
    const sanitizedSubreddit = sanitizeStr(subreddit);
    const pathPostfix =
        (sortBy === "top" && sortTime === "recent") || sortBy === "hot"
            ? ""
            : "/" + sanitizeStr(sortBy);
    const extraParams =
        (sortBy === "top" && sortTime === "recent") || sortBy === "hot"
            ? {}
            : { t: sortTime };

    const resp = await fetchRedditPath(
        `/r/${sanitizedSubreddit}${pathPostfix}`,
        {
            limit: 100,
            ...extraParams,
        },
    );

    const posts = chain((resp.data || {}).children)
        .map(({ data }) => new RedditPost(data))
        .filter("isPlayable")
        .filter(({ isPlayable, score }) => isPlayable && score > 0)
        .value();

    if (sortBy === "top") {
        return chain(posts).sortBy("score").reverse().value();
    }

    return posts;
};

export const getPostById = async (id?: string, fallbackSubreddit?: string) => {
    const sanitizedId = sanitizeStr(id);
    const sanitizedFallbackSubreddit = sanitizeStr(fallbackSubreddit);

    if (!sanitizedId) {
        const redditPosts = await getPostsBySubreddit({
            subreddit: sanitizedFallbackSubreddit,
        });

        const redditPost = redditPosts[0];
        if (!redditPost) throw new Error("could not load fallback post");
        return redditPost;
    }

    const resp = await fetchRedditPath(`/by_id/t3_${sanitizedId}`);
    const postData = get(resp, "data.children[0].data");
    if (!postData) throw new Error("could not load post for given id");
    const redditPost = new RedditPost(postData);

    return redditPost;
};

export const getComments = async (permalink: string) => {
    const resp = await fetchRedditPath(permalink);
    const comments: RedditComment[] = (
        chain(resp).get("[1].data.children", []) as any
    )
        .map((item: any = {}) => {
            if (
                item.data &&
                item.kind === "t1" &&
                item.data.score > 0 &&
                item.data.body !== "[deleted]" &&
                item.data.body !== "[removed]" &&
                item.data.stickied !== true
            ) {
                return new RedditComment(item.data);
            }
        })
        .compact()
        .value();

    return comments;
};
