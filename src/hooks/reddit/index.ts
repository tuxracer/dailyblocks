/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import useSWR from "swr";
import {
    getPostById,
    getPostsBySubreddit,
    getComments
} from "../../services/reddit";

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

interface UsePostProps {
    id?: string;
    subreddit?: string;
}

export const usePost = (props?: UsePostProps) => {
    const { id, subreddit } = props || {};
    const { data = null, error } = useSWR([id, subreddit], postFetcher);

    return {
        data,
        error,
        isLoading: !error && !data
    };
};

const commentsFetcher = (permalink: string) => getComments(permalink);

export const useComments = (permalink: string) => {
    const { data = null, error } = useSWR(permalink, commentsFetcher);
    return {
        data,
        error,
        isLoading: !error && !data
    };
};
