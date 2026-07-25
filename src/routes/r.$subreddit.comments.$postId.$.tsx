import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "../components/NotFound";

/**
 * dailyblocks no longer works because Reddit closed off the public JSON API, so
 * every permalink now sends the visitor to the equivalent page on reddit.com.
 * vercel.json handles this with a 308 for requests that reach the server, but a
 * client-side navigation (or a cached index.html) can still land here, in which
 * case the empty state explains what happened and offers the same hand-off.
 */
const PostNotFound: React.FC = () => {
    const params = Route.useParams();

    return (
        <NotFound
            subreddit={params.subreddit}
            permalink={window.location.pathname}
        />
    );
};

export const Route = createFileRoute("/r/$subreddit/comments/$postId/$")({
    component: PostNotFound,
    errorComponent: PostNotFound,
});
