import { Fragment, FunctionalComponent, h } from "preact";
import { usePost } from "../../hooks/reddit";
import Redirect from "../Redirect";
import { MetaTags } from "../MetaTags";

interface RedirectToDefaultProps {
    subreddit?: string;
}

export const RedirectToDefault: FunctionalComponent<RedirectToDefaultProps> = props => {
    const { data: redditPost } = usePost({ subreddit: props.subreddit });
    if (!redditPost) return null;

    return (
        <Fragment>
            <MetaTags redditPost={redditPost} />
            <Redirect to={redditPost.permalink} replace={true} />
            <div class="loading">
                <img src="/assets/loading.png" />
            </div>
        </Fragment>
    );
};
