import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { usePost } from "../hooks/useRedditPost";
import ReactPlayer from "react-player";
import { Comments } from "../components/Comments";
import { useSubreddit } from "../hooks/useSubreddit";

const PermalinkPage: React.FC = () => {
    const params = Route.useParams();
    const post = usePost(params.postId, params.subreddit);
    const subreddit = useSubreddit({ subreddit: params.subreddit });

    if (post.isLoading || subreddit.isLoading) {
        return null;
    }

    if (post.error) {
        return <div>Error loading post: {post.error.message}</div>;
    }

    if (!post.data) {
        throw notFound();
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{post.data.title}</h1>
                <div className="text-sm text-gray-600 mb-4">
                    <span>r/{post.data.subreddit}</span>
                    <span className="mx-2">•</span>
                    <span>{post.data.score} points</span>
                    <span className="mx-2">•</span>
                    <span>{post.data.numComments} comments</span>
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
            </div>

            <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <Comments permalink={post.data.permalink} />
            </div>
            <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">
                    Other posts from this subreddit
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subreddit.data?.map((post) => (
                        <ul key={post.id}>
                            <li>
                                <Link to={post.permalink}>{post.title}</Link>
                            </li>
                        </ul>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute("/r/$subreddit/comments/$postId/$")({
    component: PermalinkPage,
});
