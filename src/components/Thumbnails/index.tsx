import { Fragment, FunctionalComponent, h } from "preact";
import { useSubreddit } from "../../hooks/reddit";
import { Thumbnail } from "./components/Thumbnail";

const THUMBNAIL_SELECTOR = ".thumbnail:not(.w)";
const THUMBNAIL_SELECTOR_ACTIVE = ".thumbnail.active";

export const getActiveEl = () =>
    document.querySelector<HTMLAnchorElement>(THUMBNAIL_SELECTOR_ACTIVE) ||
    document.querySelector<HTMLAnchorElement>(THUMBNAIL_SELECTOR);

export const getNextEl = () =>
    (getActiveEl()?.nextElementSibling as HTMLAnchorElement | null) ||
    document.querySelector<HTMLAnchorElement>(THUMBNAIL_SELECTOR);

export const scrollToActiveEl = () => {
    try {
        (getActiveEl() as any)?.scrollIntoViewIfNeeded();
    } catch {
        console.warn("Unsupported action: scrollToActiveEl");
    }
};

export const playNext = () => {
    const nextThumbnailEl = getNextEl();
    if (!nextThumbnailEl) return;
    try {
        nextThumbnailEl.click();
    } catch {
        console.warn("Unsupported action: playNext");
    }
};

interface ThumbnailsProps {
    subreddit?: string;
    activePostId?: string;
}

export const Thumbnails: FunctionalComponent<ThumbnailsProps> = ({
    subreddit = "videos"
}) => {
    const { data, error, isLoading } = useSubreddit(subreddit);

    return (
        <Fragment>
            {!!error && "Unable to load thumbnails"}
            {/* {isLoading && "Loading thumbnails..."} */}
            {data?.map(redditPost => (
                <Thumbnail redditPost={redditPost} />
            ))}
        </Fragment>
    );
};
