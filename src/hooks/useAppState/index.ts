import { useSubreddit, usePost } from "../reddit";
import { useState, useEffect } from "preact/compat";

export const useAppState = (subreddit: string) => {
    const [isPlaying, setIsPlaying] = useState<boolean | null>(null);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const redditPostsResource = useSubreddit(subreddit);
    const [nextPostId, setNextPostId] = useState<string | null>(null);

    const activePostResource = usePost({
        id: activePostId || undefined,
        subreddit
    });

    useEffect(() => {
        const activePostIndex =
            redditPostsResource.data?.findIndex(
                ({ id }) => id === activePostId
            ) || 0;

        const nextPostIndex = activePostIndex + 1;

        const nextPost = redditPostsResource.data
            ? redditPostsResource.data[nextPostIndex]
            : null;

        setNextPostId(nextPost?.id || null);
    }, [activePostId, subreddit]);

    const next = () => {
        if (!nextPostId) return;
        setActivePostId(nextPostId);
    };

    return {
        redditPostsResource,
        activePostResource,
        setActivePostId,
        setIsPlaying,
        isPlaying,
        next
    };
};
