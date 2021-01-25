import { Fragment, FunctionalComponent, h } from "preact";
import { useSubreddit } from "../../hooks/reddit";
import { Thumbnail } from "./components/Thumbnail";

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
