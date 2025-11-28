import useSWR from "swr";
import {
  getPostsBySubreddit,
  type GetPostsBySubredditOptions,
} from "../../utils/reddit";

export const useSubreddit = (options: GetPostsBySubredditOptions) => {
  return useSWR(["subreddit", JSON.stringify(options)], () =>
    getPostsBySubreddit(options),
  );
};
