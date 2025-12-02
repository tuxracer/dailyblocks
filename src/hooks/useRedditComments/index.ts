import useSWR from "swr";
import { getComments } from "../../utils/reddit";

export const useComments = (permalink?: string) => {
    return useSWR(permalink ? ["comments", permalink] : null, () => {
        if (!permalink) {
            throw new Error("permalink is required to fetch comments");
        }

        return getComments(permalink);
    });
};
