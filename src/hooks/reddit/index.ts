import useSWR from "swr";
import { getPostsBySubreddit } from "../../services/reddit";

const subredditFetcher = (subreddit: string) =>
    getPostsBySubreddit({ subreddit });

export const useSubreddit = (subreddit: string) => {
    const { data = null, error } = useSWR(subreddit, subredditFetcher);
    return {
        data,
        error,
        isLoading: !error && !data
    };
};
