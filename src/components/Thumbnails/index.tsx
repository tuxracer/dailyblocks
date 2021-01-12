import { Fragment, FunctionalComponent, h } from "preact";
import { useSubreddit } from "../../hooks/reddit";
import { Thumbnail } from "./components/Thumbnail";

interface SubredditProps {
    subreddit?: string;
    activePostId?: string;
}

const Thumbnails: FunctionalComponent<SubredditProps> = ({
    subreddit = "videos",
    activePostId
}) => {
    const { data, error, isLoading } = useSubreddit(subreddit);

    console.log({ subreddit, activePostId, data, error, isLoading });

    return (
        <Fragment>
            {!!error && "Unable to load thumbnails"}
            {isLoading && "Loading..."}
            {data?.map(redditPost => (
                <Thumbnail redditPost={redditPost} />
            ))}
        </Fragment>
    );
};

export { Thumbnails };

export default Thumbnails;
