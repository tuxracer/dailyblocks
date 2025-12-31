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
import { DAILYBLOCKS_URL, REDDIT_URL } from "../consts";
import { useComments } from "../hooks/useRedditComments";
import { getPostById } from "../utils/reddit";

const PermalinkPage: React.FC = () => {
    const params = Route.useParams();
    const navigate = useNavigate();
    const post = usePost(params.postId, params.subreddit);
    const subreddit = useSubreddit({ subreddit: params.subreddit });
    const watchedVideosHistory = useWatchedVideosHistory();
    const comments = useComments(post.data?.permalink);
    const numComments = comments.data?.length || 0;
    const isCommentsPanelVisible = !comments.data || numComments > 0;

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
        <div className="flex flex-col h-dvh">
            {/* Title header */}
            <header className="w-full shrink-0 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-start gap-4">
                    {/* Play Next button */}
                    {nextUnwatchedPostPermalink && (
                        <Link
                            to={nextUnwatchedPostPermalink}
                            className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-md shrink-0"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                            >
                                <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
                            </svg>
                            <span className="hidden sm:inline">Play Next</span>
                        </Link>
                    )}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg md:text-xl font-bold mb-1 line-clamp-2 md:line-clamp-none">
                            {post.data.title}
                        </h1>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span>r/{post.data.subreddit}</span>
                            <span className="mx-2">•</span>
                            <span>{post.data.score} points</span>
                            <span className="mx-2">•</span>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={REDDIT_URL + post.data.permalink}
                                className="hover:underline"
                            >
                                {post.data.numComments} comments
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content area */}
            <div className="flex flex-col md:flex-row flex-1 min-h-0 pb-24 md:pb-0">
                {/* Left sidebar - Other posts (Desktop only) */}
                <aside className="hidden md:flex md:flex-col w-56 shrink-0 border-r border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
                    {/* Scrollable thumbnails */}
                    <div className="p-4 overflow-y-auto flex-1">
                        <Thumbnails
                            subreddit={params.subreddit}
                            selectedPostId={params.postId}
                        />
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 flex flex-col min-w-0 min-h-0">
                    {/* Video container */}
                    <div
                        className={`w-full bg-black ${
                            isCommentsPanelVisible
                                ? "aspect-video shrink-0 md:aspect-auto md:flex-1"
                                : "flex-1"
                        }`}
                    >
                        <ReactPlayer
                            className="w-full h-full"
                            src={post.data.mediaUrl}
                            controls
                            width="100%"
                            height="100%"
                            autoPlay
                            playing
                            onEnded={() => {
                                if (!nextUnwatchedPostPermalink) return;
                                navigate({ to: nextUnwatchedPostPermalink });
                            }}
                        />
                    </div>
                    {post.data.description && (
                        <div className="text-gray-300 p-4 bg-gray-900 shrink-0">
                            {post.data.description}
                        </div>
                    )}

                    {/* Comments - Mobile only (scrollable below video) */}
                    {isCommentsPanelVisible && (
                        <div className="md:hidden flex-1 overflow-y-auto bg-white dark:bg-zinc-900 p-4">
                            <Comments permalink={post.data.permalink} />
                        </div>
                    )}
                </main>

                {/* Right sidebar - Comments (Desktop only) */}
                {isCommentsPanelVisible && (
                    <aside className="hidden md:block w-72 shrink-0 border-l border-gray-200 dark:border-zinc-700 overflow-y-auto bg-white dark:bg-zinc-900">
                        <div className="p-4">
                            <Comments permalink={post.data.permalink} />
                        </div>
                    </aside>
                )}
            </div>

            {/* Fixed bottom thumbnails - Mobile only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-zinc-800 pt-4 pb-3 border-t border-gray-200 dark:border-zinc-700">
                {/* Scrollable thumbnails */}
                <div className="overflow-x-auto px-4">
                    <Thumbnails
                        subreddit={params.subreddit}
                        selectedPostId={params.postId}
                        horizontal
                    />
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute("/r/$subreddit/comments/$postId/$")({
    component: PermalinkPage,
    loader: async ({ params }) => {
        const post = await getPostById(params.postId, params.subreddit);
        return { post };
    },
    head: ({ loaderData }) => {
        const post = loaderData?.post;
        if (!post?.title) {
            return { meta: [] };
        }
        return {
            meta: [
                { title: post.title },
                { property: "og:title", content: post.title },
                {
                    property: "og:url",
                    content: DAILYBLOCKS_URL + post.permalink,
                },
                { property: "og:image", content: post.thumbnailUrl },
                { property: "og:image:type", content: "image/jpeg" },
                ...(post.over18
                    ? [
                          { property: "og:restrictions:age", content: "18+" },
                          {
                              name: "rating",
                              content: "RTA-5042-1996-1400-1577-RTA",
                          },
                      ]
                    : []),
            ],
        };
    },
});
