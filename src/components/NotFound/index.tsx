import { track } from "@vercel/analytics";
import { REDDIT_URL } from "../../consts";

/**
 * Payload routes attach to `notFound()`, forwarded by TanStack Router to the
 * root `notFoundComponent` as its `data` prop.
 */
export interface NotFoundData {
    /** Subreddit the visitor was trying to watch, when it is known. */
    subreddit?: string;
    /**
     * Path to continue to on reddit.com, for when a specific post is known.
     * Falls back to the subreddit listing, then to reddit.com itself.
     */
    permalink?: string;
}

type NotFoundProps = NotFoundData;

/** Source repository, linked as a footnote under the deprecation notice. */
const GITHUB_URL = "https://github.com/tuxracer/dailyblocks";

/** Other projects worth a visit now that dailyblocks is retired. */
const OTHER_PROJECTS = [
    {
        name: "dashradar.app",
        description: "Police detection on your dash using just your phone",
        url: "https://dashradar.app",
    },
    {
        name: "tuxbank.app",
        description: "Privacy first calendar budget app",
        url: "https://tuxbank.app",
    },
];

/** Vercel Web Analytics custom event fired when the Reddit CTA is clicked. */
const CONTINUE_ON_REDDIT_EVENT = "continue_on_reddit";

/** Vercel Web Analytics custom event fired when another project is clicked. */
const OTHER_PROJECT_EVENT = "other_project_click";

/**
 * Play button with an arrow leaving it, shown in the header badge. The arrow
 * frames the page as a hand-off to Reddit rather than a dead end.
 */
const PlayElsewhereIcon: React.FC<{ className?: string }> = (props) => (
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
        <path d="M20.5 12.8a8.5 8.5 0 1 1-6.4-8.2" />
        <path d="M10.2 9.1 14.6 12l-4.4 2.9V9.1Z" />
        <path d="M15.5 3.5H21v5.5" />
        <path d="M21 3.5 16 8.5" />
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
 * Shown for routes that have nothing to play. It frames the page as a hand-off
 * rather than a dead end: the content still exists, it just has to be watched
 * on reddit.com now, so the page leads with the equivalent Reddit link.
 */
export const NotFound: React.FC<NotFoundProps> = (props) => {
    const redditPath =
        props.permalink ?? (props.subreddit ? `/r/${props.subreddit}` : "");
    const redditUrl = REDDIT_URL + redditPath;

    /**
     * Records the hand-off to Reddit in Vercel Web Analytics. The browser
     * navigates away right after this, so the event is best effort.
     */
    const handleContinueClick = () => {
        track(CONTINUE_ON_REDDIT_EVENT, {
            subreddit: props.subreddit ?? null,
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
                        <PlayElsewhereIcon className="size-8 sm:size-10" />
                    </div>
                </div>

                <h1 className="mt-6 sm:mt-8 text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
                    Watch it on Reddit
                </h1>

                <p className="mt-3 text-sm sm:text-base text-pretty text-gray-600 dark:text-gray-400">
                    {props.permalink ? (
                        <>This post and its comments are</>
                    ) : props.subreddit ? (
                        <>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                r/{props.subreddit}
                            </span>{" "}
                            is
                        </>
                    ) : (
                        <>Every video is</>
                    )}{" "}
                    still up, just not here.
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

                <p className="mt-8 text-xs leading-relaxed text-balance text-gray-500 dark:text-gray-400">
                    dailyblocks is retired. Reddit shut off the API it ran on.{" "}
                    <a
                        className="underline underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Source on GitHub
                    </a>
                </p>

                <div className="mt-10 w-full border-t border-gray-200 dark:border-zinc-800 pt-6">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        More things I made
                    </h2>
                    <ul className="mt-3 flex flex-col gap-2">
                        {OTHER_PROJECTS.map((project) => (
                            <li key={project.url}>
                                <a
                                    className="group flex items-center gap-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 px-4 py-3 text-left transition-colors hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                    href={project.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() =>
                                        track(OTHER_PROJECT_EVENT, {
                                            project: project.name,
                                        })
                                    }
                                >
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-medium">
                                            {project.name}
                                        </span>
                                        <span className="block text-xs text-pretty text-gray-500 dark:text-gray-400">
                                            {project.description}
                                        </span>
                                    </span>
                                    <ArrowRightIcon className="size-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform group-hover:translate-x-0.5" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
};
