import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { usePost } from "../hooks/useRedditPost";
import ReactPlayer from "react-player";
import { Comments } from "../components/Comments";
import { useSubreddit } from "../hooks/useSubreddit";
import { addToWatchHistory } from "../utils/history";
import { useEffect } from "react";

const PermalinkPage: React.FC = () => {
    const params = Route.useParams();
    const post = usePost(params.postId, params.subreddit);
    const subreddit = useSubreddit({ subreddit: params.subreddit });

    useEffect(() => {
        addToWatchHistory(params.postId);
    }, [params.postId]);

    if (post.isLoading || subreddit.isLoading) {
        return null;
    }

    if (post.error) {
        return <div>Error loading post {post.error.message}</div>;
    }

    if (!post.data) {
        throw notFound();
    }

    return (
        <div className="flex h-screen">
            {/* Left sidebar - Other posts */}
            <aside className="w-80 shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50">
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">
                        r/{params.subreddit}
                    </h2>
                    <ul className="space-y-2">
                        {subreddit.data?.map((otherPost) => (
                            <li key={otherPost.id}>
                                <Link
                                    to={otherPost.permalink}
                                    className={`block p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                                        otherPost.id === post.data?.id
                                            ? "bg-white border-l-4 border-blue-500 shadow-sm"
                                            : ""
                                    }`}
                                >
                                    <span className="text-sm line-clamp-2">
                                        {otherPost.title}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        {otherPost.score} pts •{" "}
                                        {otherPost.numComments} comments
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 max-w-4xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">
                            {post.data.title}
                        </h1>
                        <div className="text-sm text-gray-600">
                            <span>r/{post.data.subreddit}</span>
                            <span className="mx-2">•</span>
                            <span>{post.data.score} points</span>
                            <span className="mx-2">•</span>
                            <span>{post.data.numComments} comments</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <ReactPlayer
                            src={post.data.mediaUrl}
                            controls
                            playing={false}
                            width="100%"
                            height="auto"
                        />
                    </div>

                    {post.data.description && (
                        <div className="mb-4 text-gray-700">
                            {post.data.description}
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <h2 className="text-xl font-semibold mb-4">Comments</h2>
                        <Comments permalink={post.data.permalink} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export const Route = createFileRoute("/r/$subreddit/comments/$postId/$")({
    component: PermalinkPage,
});
