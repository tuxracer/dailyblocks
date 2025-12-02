import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useSubreddit } from "../../hooks/useSubreddit";
import { useWatchedVideosHistory } from "../../contexts/WatchedVideosHistoryContext";

interface ThumbnailsProps {
    subreddit: string;
    selectedPostId: string;
    horizontal?: boolean;
}

export const Thumbnails: React.FC<ThumbnailsProps> = (props) => {
    const subreddit = useSubreddit({ subreddit: props.subreddit });
    const watchedVideosHistory = useWatchedVideosHistory();
    const selectedRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        selectedRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });
    }, [props.selectedPostId]);

    if (subreddit.isLoading) {
        return null;
    }

    if (subreddit.error) {
        return <div>Error loading subreddit: {subreddit.error.message}</div>;
    }

    return (
        <ul
            className={
                props.horizontal
                    ? "flex gap-3 overflow-x-auto py-1 -my-1"
                    : "space-y-3"
            }
        >
            {subreddit.data?.map((post) => {
                const isSelected = props.selectedPostId === post.id;
                const isWatched = watchedVideosHistory.isWatched(post.id);
                return (
                    <li
                        key={post.id}
                        ref={isSelected ? selectedRef : null}
                        className={`transition-all hover:scale-105 ${
                            props.horizontal ? "shrink-0 w-40" : ""
                        } ${!isSelected && isWatched ? "opacity-50 hover:opacity-100" : ""}`}
                    >
                        <Link
                            to={post.permalink}
                            className={`flex flex-col rounded-lg overflow-hidden hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${
                                isSelected
                                    ? "bg-white dark:bg-zinc-900 ring-2 ring-blue-500 shadow-sm"
                                    : ""
                            }`}
                        >
                            <img
                                src={post.thumbnailUrl}
                                alt=""
                                className="w-full aspect-video object-cover bg-gray-200 dark:bg-zinc-700"
                            />
                            <div className="flex flex-col p-2">
                                <span
                                    className={`text-sm ${props.horizontal ? "line-clamp-2" : ""}`}
                                >
                                    {post.title}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {post.score} pts • {post.numComments}{" "}
                                    comments
                                </span>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
