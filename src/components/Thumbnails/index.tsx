import { Link } from "@tanstack/react-router";
import { useSubreddit } from "../../hooks/useSubreddit";

interface ThumbnailsProps {
    subreddit: string;
    selectedPostId: string;
}

export const Thumbnails: React.FC<ThumbnailsProps> = (props) => {
    const subreddit = useSubreddit({ subreddit: props.subreddit });

    if (subreddit.isLoading) {
        return null;
    }

    if (subreddit.error) {
        return <div>Error loading subreddit: {subreddit.error.message}</div>;
    }
    return (
        <ul className="space-y-2">
            {subreddit.data?.map((post) => (
                <li key={post.id}>
                    <Link
                        to={post.permalink}
                        className={`block p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                            props.selectedPostId === post.id
                                ? "bg-white border-l-4 border-blue-500 shadow-sm"
                                : ""
                        }`}
                    >
                        <span className="text-sm line-clamp-2">
                            {post.title}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 block">
                            {post.score} pts • {post.numComments} comments
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
};
