import { createFileRoute, Navigate, notFound } from "@tanstack/react-router";
import { useSubreddit } from "../hooks/useSubreddit";

const SubredditPage: React.FC = () => {
    const params = Route.useParams();
    const subreddit = useSubreddit({ subreddit: params.subreddit });
    const firstPostPermalink = subreddit.data?.[0]?.permalink;

    if (subreddit.isLoading) {
        return null;
    }

    if (!firstPostPermalink) {
        throw notFound();
    }

    return <Navigate to={firstPostPermalink} replace />;
};

export const Route = createFileRoute("/r/$subreddit/")({
    component: SubredditPage,
});
