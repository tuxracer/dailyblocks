import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import RedditPost from "../../../../models/RedditPost";

interface ThumbnailProps {
    redditPost: RedditPost;
}

const Thumbnail: FunctionalComponent<ThumbnailProps> = ({ redditPost }) => {
    const { permalink, title, thumbnailUrl } = redditPost;
    return (
        <Link href={permalink} activeClassName="active" class="thumbnail">
            <img class="blur" src={thumbnailUrl} />
            <img class="original" src={thumbnailUrl} />
            <img class="spacer" src={thumbnailUrl} />
            <div>{title}</div>
        </Link>
    );
};

export { Thumbnail };

export default Thumbnail;
