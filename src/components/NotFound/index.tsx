import { track } from "@vercel/analytics";
import { REDDIT_URL } from "../../consts";

/**
 * Payload routes attach to `notFound()`, forwarded by TanStack Router to the
 * root `notFoundComponent` as its `data` prop.
 *
 * Both fields come from the URL, so anyone can put anything in them. They only
 * ever build the reddit.com link, which cannot leave that host because the
 * origin is a fixed prefix. Keep them out of the copy so the page cannot be
 * used to display arbitrary text under this domain.
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

/**
 * Shared treatment for the two structural labels, the wordmark above the
 * headline and the heading over the project list. Monospace and wide tracking
 * set them apart from the prose so they read as signposts rather than content.
 */
const LABEL_CLASS =
    "font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400";

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
        <main className="min-h-dvh w-full flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center">
                    <span className="flex size-11 items-center justify-center rounded-full bg-orange-500/12 text-orange-600 ring-1 ring-inset ring-orange-500/30 dark:text-orange-400">
                        <PlayElsewhereIcon className="size-5" />
                    </span>

                    <p className={`${LABEL_CLASS} mt-5`}>dailyblocks</p>

                    <h1 className="mt-2.5 text-[1.75rem] sm:text-[2.125rem] font-semibold leading-tight tracking-[-0.02em] text-balance">
                        Watch it on Reddit
                    </h1>

                    <p className="mt-2.5 text-[0.9375rem] sm:text-base text-pretty text-gray-600 dark:text-gray-400">
                        Every video is still up, just not here.
                    </p>

                    <a
                        className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-orange-500 active:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                        href={redditUrl}
                        rel="noreferrer"
                        onClick={handleContinueClick}
                    >
                        Continue on Reddit
                        <ArrowRightIcon className="size-4" />
                    </a>

                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-balance text-gray-500 dark:text-gray-400">
                        dailyblocks is retired. Reddit shut off the API it ran
                        on.{" "}
                        <a
                            className="underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 dark:decoration-zinc-700 dark:hover:text-gray-200"
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Source on GitHub
                        </a>
                    </p>
                </div>

                <div className="mt-16 sm:mt-20">
                    <h2 className={LABEL_CLASS}>More things I made</h2>
                    <ul className="mt-3 border-y border-gray-200 divide-y divide-gray-200 dark:border-zinc-800 dark:divide-zinc-800">
                        {OTHER_PROJECTS.map((project) => (
                            <li key={project.url}>
                                <a
                                    className="group flex items-center gap-4 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
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
                                        <span className="block text-[0.9375rem] font-medium">
                                            {project.name}
                                        </span>
                                        <span className="mt-0.5 block text-[0.8125rem] text-pretty text-gray-500 dark:text-gray-400">
                                            {project.description}
                                        </span>
                                    </span>
                                    <ArrowRightIcon className="size-4 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-600 motion-reduce:transform-none dark:text-zinc-500 dark:group-hover:text-gray-300" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
};
