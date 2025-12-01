import { Link } from "@tanstack/react-router";
import { useSubreddit } from "../../hooks/useSubreddit";
import { useWatchedVideosHistory } from "../../contexts/WatchedVideosHistoryContext";

interface ThumbnailsProps {
    subreddit: string;
    selectedPostId: string;
}

export const Thumbnails: React.FC<ThumbnailsProps> = (props) => {
    const subreddit = useSubreddit({ subreddit: props.subreddit });
    const watchedVideosHistory = useWatchedVideosHistory();

    if (subreddit.isLoading) {
        return null;
    }

    if (subreddit.error) {
        return <div>Error loading subreddit: {subreddit.error.message}</div>;
    }

    return (
        <ul className="space-y-3">
            {subreddit.data?.map((post) => {
                const isSelected = props.selectedPostId === post.id;
                const isWatched = watchedVideosHistory.isWatched(post.id);
                return (
                    <li
                        key={post.id}
                        className={`${!isSelected && isWatched ? "opacity-50" : ""}`}
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
                                <span className="text-sm">{post.title}</span>
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
