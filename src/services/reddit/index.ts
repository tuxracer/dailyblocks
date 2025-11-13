/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { stringify } from "qs";
import { chain, get } from "lodash";
import { RedditPost } from "../../models/RedditPost";
import memoize from "memoizee";
import { URLS, MINUTE_MS, DAY_MS, BLACKLIST } from "../../common/consts";
import { sanitizeStr, logServer } from "../../common/helpers";
import { RedditComment } from "../../models/RedditComment";

export const fetchUrl = async (
    url: string,
    method?: "POST" | "GET" | "PUT" | "DELETE"
) => {
    const resp = await fetch(url, { method, cache: "no-cache" });
    const json: any = await resp.json();
    return json;
};

export const fetchRedditPath = async (
    pathname: string,
    params?: { [id: string]: any }
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

interface GetPostsBySubredditOptions {
    subreddit?: string;
    sortBy?: SortBy;
    sortTime?: SortTime;
}

const defaultGetPostsBySubredditOptions: GetPostsBySubredditOptions = {
    subreddit: "videos",
    sortBy: "hot",
    sortTime: "recent"
};

export const getPostsBySubreddit = memoize(
    async ({
        subreddit = defaultGetPostsBySubredditOptions.subreddit,
        sortBy = defaultGetPostsBySubredditOptions.sortBy,
        sortTime = defaultGetPostsBySubredditOptions.sortTime
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

        logServer("getPostsBySubreddit", sanitizedSubreddit);
        const resp = await fetchRedditPath(
            `/r/${sanitizedSubreddit}${pathPostfix}`,
            {
                limit: 100,
                ...extraParams
            }
        );

        const posts = chain((resp.data || {}).children)
            .map(({ data }) => new RedditPost(data))
            .filter("isPlayable")
            .filter(
                ({ id, isPlayable, score }) =>
                    isPlayable && !BLACKLIST.includes(id) && score > 0
            )
            .value();

        if (sortBy === "top") {
            return chain(posts)
                .sortBy("score")
                .reverse()
                .value();
        }

        return posts;
    },
    {
        promise: true,
        maxAge: MINUTE_MS * 20,
        preFetch: true,
        normalizer: args => {
            const {
                subreddit = defaultGetPostsBySubredditOptions.subreddit,
                sortBy = defaultGetPostsBySubredditOptions.sortBy,
                sortTime = defaultGetPostsBySubredditOptions.sortTime
            } = args[0];
            return JSON.stringify({
                subreddit,
                sortBy,
                sortTime
            }).toLocaleLowerCase();
        }
    }
);

export const getCachedPost = async (id: string, subreddit: string) => {
    const sanitizedId = sanitizeStr(id);
    const sanitizedSubreddit = sanitizeStr(subreddit);
    // console.log("getCachedPost", sanitizedId);
    if (
        !sanitizedId ||
        !sanitizedSubreddit ||
        BLACKLIST.includes(sanitizedId)
    ) {
        return;
    }

    const redditPostsBySubreddit = await getPostsBySubreddit({ subreddit });
    return redditPostsBySubreddit.find(redditPost => redditPost.id === id);
};

export const getPostById = memoize(
    async (id?: string, fallbackSubreddit?: string) => {
        const sanitizedId = sanitizeStr(id);
        const sanitizedFallbackSubreddit = sanitizeStr(fallbackSubreddit);

        if (BLACKLIST.includes(sanitizedId || "")) {
            throw new Error("Invalid post ID");
        }

        if (!sanitizedId) {
            const redditPosts = await getPostsBySubreddit({
                subreddit: sanitizedFallbackSubreddit
            });
            const unwatchedRedditPost = redditPosts.find(
                redditPost => !redditPost.isWatched
            );
            const redditPost = unwatchedRedditPost || redditPosts[0];
            if (!redditPost) throw new Error("could not load fallback post");
            return redditPost;
        }

        const cachedRedditPost = sanitizedFallbackSubreddit
            ? await getCachedPost(sanitizedId, sanitizedFallbackSubreddit)
            : undefined;

        if (cachedRedditPost) return cachedRedditPost;

        const resp = await fetchRedditPath(`/by_id/t3_${sanitizedId}`);
        const postData = get(resp, "data.children[0].data");
        if (!postData) throw new Error("could not load post for given id");
        const redditPost = new RedditPost(postData);

        return redditPost;
    },
    { promise: true, maxAge: DAY_MS }
);

export const getComments = memoize(
    async (permalink: string) => {
        logServer("getComments", permalink);

        const isBlacklisted = Boolean(
            BLACKLIST.find(id => permalink.includes(id))
        );

        if (isBlacklisted) throw new Error("Invalid post ID for comments");

        const resp = await fetchRedditPath(permalink);
        const comments: RedditComment[] = (chain(resp).get(
            "[1].data.children",
            []
        ) as any)
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
    },
    { promise: true, maxAge: MINUTE_MS * 5 }
);
