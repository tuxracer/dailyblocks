import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import RedditPost from "../../../../models/RedditPost";

interface ThumbnailProps {
    redditPost: RedditPost;
}

const Thumbnail: FunctionalComponent<ThumbnailProps> = props => {
    return (
        <Link href={props.redditPost.permalink}>{props.redditPost.title}</Link>
    );
};

export { Thumbnail };

export default Thumbnail;
