import useSWR from "swr";
import { getPostById, getPostsBySubreddit } from "../../services/reddit";

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

const postFetcher = (id: string = "", subreddit?: string) =>
    getPostById(id, subreddit);

interface usePostProps {
    id?: string;
    subreddit?: string;
}

export const usePost = ({ id, subreddit }: usePostProps) => {
    const { data = null, error } = useSWR([id, subreddit], postFetcher);

    console.log("usePost", { id, subreddit });

    return {
        data,
        error,
        isLoading: !error && !data
    };
};
