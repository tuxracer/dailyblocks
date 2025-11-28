import useSWR from "swr";
import { getComments } from "../../utils/reddit";

export const useComments = (permalink: string) => {
  return useSWR(["comments", permalink], () => getComments(permalink));
};
