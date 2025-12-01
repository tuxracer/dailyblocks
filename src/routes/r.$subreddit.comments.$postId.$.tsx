import { createFileRoute, notFound } from "@tanstack/react-router";
import { usePost } from "../hooks/useRedditPost";
import ReactPlayer from "react-player";
import { Comments } from "../components/Comments";
import { useSubreddit } from "../hooks/useSubreddit";
import { addToWatchHistory } from "../utils/history";
import { useEffect } from "react";
import { Thumbnails } from "../components/Thumbnails";

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
        <div className="flex flex-col h-screen">
            {/* Title header - Full width */}
            <header className="w-full shrink-0 border-b border-gray-200 bg-white px-6 py-4">
                <h1 className="text-2xl font-bold mb-1">{post.data.title}</h1>
                <div className="text-sm text-gray-600">
                    <span>r/{post.data.subreddit}</span>
                    <span className="mx-2">•</span>
                    <span>{post.data.score} points</span>
                    <span className="mx-2">•</span>
                    <span>{post.data.numComments} comments</span>
                </div>
            </header>

            {/* Main content area */}
            <div className="flex flex-1 min-h-0">
                {/* Left sidebar - Other posts */}
                <aside className="w-80 shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">
                            r/{params.subreddit}
                        </h2>
                        <Thumbnails
                            subreddit={params.subreddit}
                            selectedPostId={params.postId}
                        />
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 flex flex-col min-w-0 bg-black">
                    <div className="flex-1 flex items-center justify-center">
                        <ReactPlayer
                            src={post.data.mediaUrl}
                            controls
                            playing={false}
                            width="100%"
                            height="100%"
                            style={{ maxHeight: "100%" }}
                            autoPlay
                            // @ts-ignore
                            playing
                        />
                    </div>
                    {post.data.description && (
                        <div className="text-gray-300 p-4 bg-gray-900">
                            {post.data.description}
                        </div>
                    )}
                </main>

                {/* Right sidebar - Comments */}
                <aside className="w-72 shrink-0 border-l border-gray-200 overflow-y-auto bg-white">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">
                            Comments ({post.data.numComments})
                        </h2>
                        <Comments permalink={post.data.permalink} />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export const Route = createFileRoute("/r/$subreddit/comments/$postId/$")({
    component: PermalinkPage,
});
