import { createFileRoute, Navigate, notFound } from "@tanstack/react-router";
import { DEFAULT_SUBREDDIT } from "../consts";
import { useSubreddit } from "../hooks/useSubreddit";

const RouteComponent: React.FC = () => {
    const subreddit = useSubreddit({ subreddit: DEFAULT_SUBREDDIT });

    if (subreddit.isLoading) {
        return null;
    }

    if (!subreddit.firstPostPermalink) {
        throw notFound();
    }

    return <Navigate to={subreddit.firstPostPermalink} replace />;
};

export const Route = createFileRoute("/")({
    component: RouteComponent,
});
