import useSWR from "swr";
import {
    getPostsBySubreddit,
    type GetPostsBySubredditOptions,
} from "../../utils/reddit";

export const useSubreddit = (options?: GetPostsBySubredditOptions) => {
    const subreddit = useSWR(
        options?.subreddit ? ["subreddit", JSON.stringify(options)] : null,
        () => {
            if (!options?.subreddit) {
                throw new Error("subreddit is required");
            }

            return getPostsBySubreddit(options);
        },
    );

    const firstPostPermalink = subreddit.data?.[0]?.permalink;

    return {
        ...subreddit,
        firstPostPermalink,
    };
};
