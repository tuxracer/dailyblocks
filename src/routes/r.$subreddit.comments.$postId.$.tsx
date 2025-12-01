import {
    createFileRoute,
    Link,
    notFound,
    useNavigate,
} from "@tanstack/react-router";
import { usePost } from "../hooks/useRedditPost";
import ReactPlayer from "react-player";
import { Comments } from "../components/Comments";
import { useSubreddit } from "../hooks/useSubreddit";
import { useEffect } from "react";
import { Thumbnails } from "../components/Thumbnails";
import { useWatchedVideosHistory } from "../contexts/WatchedVideosHistoryContext";

const PermalinkPage: React.FC = () => {
    const params = Route.useParams();
    const navigate = useNavigate();
    const post = usePost(params.postId, params.subreddit);
    const subreddit = useSubreddit({ subreddit: params.subreddit });
    const watchedVideosHistory = useWatchedVideosHistory();

    useEffect(() => {
        watchedVideosHistory.add(params.postId);
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

    const nextUnwatchedPostPermalink = subreddit.data?.find(
        (post) => !watchedVideosHistory.isWatched(post.id),
    )?.permalink;

    return (
        <div className="flex flex-col h-screen">
            {/* Title header */}
            <header className="w-full shrink-0 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-4">
                <h1 className="text-xl font-bold mb-1">{post.data.title}</h1>
                <div className="text-sm text-gray-600 dark:text-gray-400">
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
                <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-zinc-700 overflow-y-auto bg-gray-50 dark:bg-zinc-800">
                    <div className="p-4">
                        {nextUnwatchedPostPermalink && (
                            <Link
                                to={nextUnwatchedPostPermalink}
                                className="inline-block text-lg font-semibold mb-4 hover:underline"
                            >
                                /r/{params.subreddit}
                            </Link>
                        )}
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
                            width="100%"
                            height="100%"
                            style={{ maxHeight: "100%" }}
                            autoPlay
                            playing
                            onEnded={() => {
                                if (!nextUnwatchedPostPermalink) return;
                                navigate({ to: nextUnwatchedPostPermalink });
                            }}
                        />
                    </div>
                    {post.data.description && (
                        <div className="text-gray-300 p-4 bg-gray-900">
                            {post.data.description}
                        </div>
                    )}
                </main>

                {/* Right sidebar - Comments */}
                <aside className="w-72 shrink-0 border-l border-gray-200 dark:border-zinc-700 overflow-y-auto bg-white dark:bg-zinc-900">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
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
