import { FunctionalComponent, h } from "preact";
import { Helmet } from "react-helmet";
import { URLS } from "../../common/consts";
import { RedditPost } from "../../models/RedditPost";

interface MetaTagsProps {
    redditPost: RedditPost;
}

export const MetaTags: FunctionalComponent<MetaTagsProps> = ({
    redditPost
}) => {
    return (
        <Helmet>
            <title>{redditPost.title}</title>
            <meta property="og:title" content={redditPost.title} />
            <meta
                property="og:url"
                content={URLS.DAILYBLOCKS + redditPost.permalink}
            />
            <meta property="og:image" content={redditPost.thumbnailUrl} />
            <meta property="og:image:type" content="image/jpeg" />
            {redditPost.over18 && (
                <meta property="og:restrictions:age" content="18+" />
            )}
            {redditPost.over18 && (
                <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
            )}
            <meta name="theme-color" content="#000000" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={redditPost.title} />
            <meta name="twitter:image" content={redditPost.thumbnailUrl} />
        </Helmet>
    );
};
