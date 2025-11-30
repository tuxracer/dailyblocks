import useSWR from "swr";
import { getPostById } from "../../utils/reddit";
import { useSubreddit } from "../useSubreddit";
import { isWatched } from "../../utils/history";

export const usePost = (id?: string, subreddit?: string) => {
    const subredditData = useSubreddit({ subreddit });
    const postFromSubredditData = subredditData.data?.find(
        (post) => post.id === id,
    );

    const post = useSWR(
        id && !postFromSubredditData ? [id, subreddit] : null,
        () => {
            if (!id) {
                throw new Error("id is required");
            }
            return getPostById(id, subreddit);
        },
    );

    const data = postFromSubredditData || post.data;

    if (data) {
        data.isWatched = isWatched(data.id);
    }

    return {
        data,
        isLoading: subredditData.isLoading || post.isLoading,
        error: subredditData.error || post.error,
    };
};
