import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { scoreToShortScore } from "../../../../common/helpers";
import RedditPost from "../../../../models/RedditPost";

interface ThumbnailProps {
    redditPost: RedditPost;
}

export const Thumbnail: FunctionalComponent<ThumbnailProps> = ({
    redditPost
}) => {
    const { permalink, title, thumbnailUrl, score } = redditPost;

    return (
        <Link href={permalink} activeClassName="active" class="thumbnail">
            <img class="blur" src={thumbnailUrl} />
            <img class="original" src={thumbnailUrl} />
            <img class="spacer" src={thumbnailUrl} />
            <caption>
                <div class="title">{title}</div>
                <div class="score">▲ {scoreToShortScore(score)}</div>
            </caption>
        </Link>
    );
};
