import { track } from "@vercel/analytics";
import { REDDIT_URL } from "../../consts";

/**
 * Payload routes attach to `notFound()`, forwarded by TanStack Router to the
 * root `notFoundComponent` as its `data` prop.
 */
export interface NotFoundData {
    /** Subreddit the visitor was trying to watch, when it is known. */
    subreddit?: string;
}

type NotFoundProps = NotFoundData;

/** Source repository, linked as a footnote under the deprecation notice. */
const GITHUB_URL = "https://github.com/tuxracer/dailyblocks";

/** Vercel Web Analytics custom event fired when the Reddit CTA is clicked. */
const CONTINUE_ON_REDDIT_EVENT = "continue_on_reddit";

/** Video camera with a slash through it, shown in the header badge. */
const NoVideoIcon: React.FC<{ className?: string }> = (props) => (
    <svg
        className={props.className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M10.7 6H14a2 2 0 0 1 2 2v3.3l1 1L22 8v8" />
        <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z" />
        <path d="M2 2 22 22" />
    </svg>
);

/** Trailing arrow on the "Continue on Reddit" button. */
const ArrowRightIcon: React.FC<{ className?: string }> = (props) => (
    <svg
        className={props.className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 12h13" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

/**
 * Empty state for routes that cannot find anything to play. It explains why the
 * player is empty and sends the visitor to the equivalent page on reddit.com,
 * which is where every dailyblocks URL now points.
 */
export const NotFound: React.FC<NotFoundProps> = (props) => {
    const redditUrl = props.subreddit
        ? `${REDDIT_URL}/r/${props.subreddit}`
        : REDDIT_URL;

    /**
     * Records the hand-off to Reddit in Vercel Web Analytics. The browser
     * navigates away right after this, so the event is best effort.
     */
    const handleContinueClick = () => {
        track(CONTINUE_ON_REDDIT_EVENT, {
            subreddit: props.subreddit ?? null,
            destination: redditUrl,
        });
    };

    return (
        <main className="min-h-dvh w-full flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md flex flex-col items-center text-center">
                <div className="relative">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-orange-500/25 blur-2xl"
                    />
                    <div className="flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25">
                        <NoVideoIcon className="size-8 sm:size-10" />
                    </div>
                </div>

                <h1 className="mt-6 sm:mt-8 text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
                    No videos found
                </h1>

                <p className="mt-3 text-sm sm:text-base text-pretty text-gray-600 dark:text-gray-400">
                    {props.subreddit ? (
                        <>
                            There is nothing to play from{" "}
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                r/{props.subreddit}
                            </span>{" "}
                            here anymore.
                        </>
                    ) : (
                        <>There is nothing to play at this address anymore.</>
                    )}{" "}
                    Reddit still has it all.
                </p>

                <a
                    className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-orange-500 active:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    href={redditUrl}
                    rel="noreferrer"
                    onClick={handleContinueClick}
                >
                    Continue on Reddit
                    <ArrowRightIcon className="size-4" />
                </a>

                <p className="mt-10 max-w-prose rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 px-4 py-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        Deprecated.
                    </span>{" "}
                    Reddit now returns HTTP 403 for all requests. This project
                    depended on Reddit allowing unauthenticated requests from
                    arbitrary hosts, which is no longer the case.
                </p>

                <a
                    className="mt-4 text-xs text-gray-500 dark:text-gray-400 underline underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                >
                    View the source code on GitHub
                </a>
            </div>
        </main>
    );
};
