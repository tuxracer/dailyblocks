import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { scoreToShortScore } from "../../../../common/helpers";
import RedditPost from "../../../../models/RedditPost";
import classnames from "classnames";
import Tilt from "preact-tilt";

interface ThumbnailProps {
    redditPost: RedditPost;
}

export const Thumbnail: FunctionalComponent<ThumbnailProps> = ({
    redditPost
}) => {
    const { permalink, title, thumbnailUrl, score, isWatched } = redditPost;

    return (
        <Link
            href={permalink}
            activeClassName="active"
            class={classnames("thumbnail", "h-entry", isWatched ? "w" : "u")}
        >
            <div className="images">
                <img class="blur" src={thumbnailUrl} />
                <Tilt
                    style={{ transformStyle: "preserve-3d" }}
                    className="tilt"
                    settings={{
                        scale: 1.05,
                        gyroscope: false
                    }}
                >
                    <img class="original" src={thumbnailUrl} />
                    <img class="spacer" src={thumbnailUrl} />
                </Tilt>
            </div>

            <caption class="h-review-aggregate">
                <div class="title p-name p-item">{title}</div>
                <div class="score">
                    ▲ <span class="p-average">{scoreToShortScore(score)}</span>
                </div>
            </caption>
        </Link>
    );
};
