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
        <ul className="space-y-2">
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
                            className={`flex gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${
                                isSelected
                                    ? "bg-white dark:bg-zinc-900 border-l-4 border-blue-500 shadow-sm"
                                    : ""
                            }`}
                        >
                            <img
                                src={post.thumbnailUrl}
                                alt=""
                                className="w-16 h-16 object-cover rounded shrink-0 bg-gray-200 dark:bg-zinc-700"
                            />
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm line-clamp-2">
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
