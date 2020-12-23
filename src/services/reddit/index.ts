import { stringify } from "qs";
import { chain, get } from "lodash";
import { RedditPost } from "../../models/RedditPost";
import memoize from "memoizee";
import { URLS, MINUTE_MS, BLACKLIST } from '../../common/consts';
import { sanitizeStr, logServer } from '../../common/helpers';

export const fetchUrl = async (
    url: string,
    method?: "POST" | "GET" | "PUT" | "DELETE"
) => {
    const resp = await fetch(url, { method });
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
    sortBy: "top",
    sortTime: "recent",
};

export const getPostsBySubreddit = memoize(
    async ({
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

        logServer("getPostsBySubreddit", sanitizedSubreddit);
        const resp = await fetchRedditPath(
            `/r/${sanitizedSubreddit}${pathPostfix}`,
            {
                limit: 100,
                ...extraParams,
            }
        );

        const posts = chain(((resp as any).data || {}).children)
            .map(({ data }) => new RedditPost(data))
            .filter("isPlayable")
            .filter(
                ({ id, isPlayable }) => isPlayable && !BLACKLIST.includes(id)
            )
            .value();

        if (sortBy === "top") {
            return chain(posts).sortBy("score").reverse().value();
        }

        return posts;
    },
    {
        promise: true,
        maxAge: MINUTE_MS * 20,
        preFetch: true,
        normalizer: (args) => {
            const {
                subreddit = defaultGetPostsBySubredditOptions.subreddit,
                sortBy = defaultGetPostsBySubredditOptions.sortBy,
                sortTime = defaultGetPostsBySubredditOptions.sortTime,
            } = args[0] as GetPostsBySubredditOptions;
            return JSON.stringify({
                subreddit,
                sortBy,
                sortTime,
            }).toLocaleLowerCase();
        },
    }
);

export const getPostById = memoize(
    async (id?: string, fallbackSubreddit?: string) => {
        const sanitizedId = sanitizeStr(id);
        console.log("getPostById", sanitizedId);
        if (!sanitizedId) {
            const redditPost = (
                await getPostsBySubreddit({ subreddit: fallbackSubreddit })
            )[0];
            if (!redditPost) throw new Error("could not load fallback post");
            return redditPost;
        }

        const resp = await fetchRedditPath(`/by_id/t3_${sanitizedId}`);
        const postData = get(resp, "data.children[0].data");
        if (!postData) throw new Error("could not load post for given id");
        const redditPost = new RedditPost(postData);

        return redditPost;
    },
    { promise: true, max: 50000 }
);

// export const getPostByIdFastest = memoize(
//     async (id?: string, fallbackSubreddit?: string) => {
//         const sanitizedId = sanitizeStr(id);
//         console.log("getPostByIdFastest", sanitizedId);
//         const sanitizedFallbackSubreddit = sanitizeStr(fallbackSubreddit);

//         const redditPost = (await firstResolve([
//             getPostById(sanitizedId, sanitizedFallbackSubreddit),
//             getCachedPost(sanitizedId),
//         ])) as RedditPost;

//         return redditPost;
//     },
//     { promise: true, max: 50000 }
// );

// export const getComments = memoize(
//     async (permalink: string) => {
//         logServer("getComments", permalink);
//         const resp = await fetchRedditPath(permalink);
//         const comments: RedditComment[] = (chain(resp).get(
//             "[1].data.children",
//             []
//         ) as any)
//             .map((item: any = {}) => {
//                 if (
//                     item.data &&
//                     item.kind === "t1" &&
//                     item.data.body !== "[deleted]" &&
//                     item.data.body !== "[removed]"
//                 ) {
//                     return new RedditComment(item.data);
//                 }
//             })
//             .compact()
//             .value();

//         return comments;
//     },
//     { promise: true, maxAge: MINUTE_MS * 120, preFetch: true }
// );

// export const getCachedPost = memoize(
//     async (id: string) => {
//         const sanitizedId = sanitizeStr(id);
//         console.log("getCachedPost", sanitizedId);
//         if (!sanitizedId) return;

//         const resp = await fetch("https://dailyblocks.tv/api/post/" + id);
//         if (resp.status !== 200)
//             throw new Error("Unable to fetch existing post " + resp.status);

//         const post: Post = await resp.json();
//         const redditPost = RedditPost.fromPost(post);
//         return redditPost;
//     },
//     { promise: true, max: 50000 }
// );

// export const trackView = memoize(
//     async (id: string) => {
//         if (1 === 1) return;
//         const sanitizedId = sanitizeStr(id);

//         if (isDoNotTrackEnabledClientside()) return console.log("skipping tv.");

//         let url = "/api/post/" + sanitizedId;

//         const referrer = getInitialReferrer();
//         if (referrer) url = url + "?referrer=" + referrer;

//         const views: number = await fetchUrl(url, "POST");
//         return views;
//     },
//     { promise: true }
// );

// export const getTop = async (limit?: number) => {
//     if (typeof limit === "string") return [] as Post[];
//     let url = "https://dailyblocks.tv/api/post";
//     if (limit) url = url + "?limit=" + limit;
//     return (await fetchUrl(url)) as Post[];
// };

// export const getReferrers = async (postId: string, limit?: number) => {
//     if (typeof postId !== "string") return [] as string[];
//     let url = "https://dailyblocks.tv/api/referrers/" + postId;
//     if (limit) url = url + "?limit=" + limit;
//     const referrers = (await fetchUrl(url)) as string[];
//     return referrers;
// };
