import useSWR from "swr";
import {
    getPostsBySubreddit,
    type GetPostsBySubredditOptions,
} from "../../utils/reddit";
import { useWatchedVideosHistory } from "../../contexts/WatchedVideosHistoryContext";

export const useSubreddit = (options?: GetPostsBySubredditOptions) => {
    const watchedVideosHistory = useWatchedVideosHistory();
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
    const firstUnwatchedPostPermalink = subreddit.data?.find(
        (post) => !watchedVideosHistory.isWatched(post.id),
    )?.permalink;

    const firstPermalink = firstUnwatchedPostPermalink || firstPostPermalink;

    return {
        ...subreddit,
        firstPermalink,
    };
};
