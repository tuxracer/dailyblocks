import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { REDDIT_URL } from "../consts";

/**
 * dailyblocks no longer works because Reddit closed off the public JSON API, so
 * every permalink now sends the visitor to the equivalent page on reddit.com.
 * vercel.json handles this with a 308 for requests that reach the server, but a
 * client-side navigation (or a cached index.html) can still land here, so we
 * redirect from the browser too. We do both a JS redirect (immediate) and a
 * <meta> refresh (fallback). React 19 hoists the <meta> tag into the document
 * <head> automatically.
 */
const RedditRedirect: React.FC = () => {
    const redditUrl = REDDIT_URL + window.location.pathname;

    useEffect(() => {
        window.location.replace(redditUrl);
    }, [redditUrl]);

    return (
        <>
            <meta httpEquiv="refresh" content={`0; url=${redditUrl}`} />
            <div className="w-full h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
                <div>Redirecting to Reddit…</div>
                <a
                    className="text-sm text-blue-500 underline"
                    href={redditUrl}
                    rel="noreferrer"
                >
                    Click here if you are not redirected automatically.
                </a>
            </div>
        </>
    );
};

export const Route = createFileRoute("/r/$subreddit/comments/$postId/$")({
    component: RedditRedirect,
    errorComponent: RedditRedirect,
});
