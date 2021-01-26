import { Fragment, FunctionalComponent, h } from "preact";
import { useSubreddit } from "../../hooks/reddit";
import { Thumbnail } from "./components/Thumbnail";

export const getActiveEl = () =>
    document.querySelector<HTMLAnchorElement>(".thumbnail.active") ||
    document.querySelector<HTMLAnchorElement>(".thumbnail");

export const getNextEl = () =>
    (getActiveEl()?.nextElementSibling as HTMLAnchorElement | null) ||
    document.querySelector<HTMLAnchorElement>(".thumbnail");

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
