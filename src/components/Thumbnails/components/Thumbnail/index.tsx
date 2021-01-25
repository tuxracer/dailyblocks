import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import RedditPost from "../../../../models/RedditPost";

const scoreToShortScore = (score: number) => {
    if (score < 1000) return score.toString();

    return (score / 1000).toFixed(1) + "k";
};

interface ThumbnailProps {
    redditPost: RedditPost;
}

const Thumbnail: FunctionalComponent<ThumbnailProps> = ({ redditPost }) => {
    const { permalink, title, thumbnailUrl, score } = redditPost;

    return (
        <Link href={permalink} activeClassName="active" class="thumbnail">
            <img class="blur" src={thumbnailUrl} />
            <img class="original" src={thumbnailUrl} />
            <img class="spacer" src={thumbnailUrl} />
            <caption>
                <div>{title}</div>
                <div>▲ {scoreToShortScore(score)}</div>
            </caption>
        </Link>
    );
};

export { Thumbnail };

export default Thumbnail;
