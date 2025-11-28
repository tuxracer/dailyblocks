import useSWR from "swr";
import { getPostById } from "../../utils/reddit";

export const usePost = (id?: string, subreddit?: string) => {
  return useSWR(id ? [id, subreddit] : null, () => {
    if (!id) {
      throw new Error("id is required");
    }
    return getPostById(id, subreddit);
  });
};
