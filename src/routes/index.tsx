import { createFileRoute, Navigate, notFound } from "@tanstack/react-router";
import { DEFAULT_SUBREDDIT } from "../consts";
import { useSubreddit } from "../hooks/useSubreddit";

const RouteComponent: React.FC = () => {
    const subreddit = useSubreddit({ subreddit: DEFAULT_SUBREDDIT });

    if (subreddit.isLoading) {
        return null;
    }

    if (!subreddit.firstPermalink) {
        // No subreddit is named here, so the empty state stays generic rather
        // than pointing at the fallback used to pick the first video.
        throw notFound();
    }

    return <Navigate to={subreddit.firstPermalink} replace />;
};

export const Route = createFileRoute("/")({
    component: RouteComponent,
});
