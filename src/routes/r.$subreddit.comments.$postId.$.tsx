import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "../components/NotFound";

/**
 * dailyblocks no longer works because Reddit closed off the public JSON API, so
 * post permalinks show the empty state and hand the visitor off to the
 * equivalent page on reddit.com. Used for load errors too, since a post that
 * cannot be fetched leaves nothing to play either way.
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
