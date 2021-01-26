import { Fragment, FunctionalComponent, h } from "preact";
import { usePost } from "../../hooks/reddit";
import Redirect from "../Redirect";
import { MetaTags } from "../MetaTags";
import { Loader } from "../Loader";

interface RedirectToDefaultProps {
    subreddit?: string;
}

export const RedirectToDefault: FunctionalComponent<RedirectToDefaultProps> = props => {
    const { data: redditPost } = usePost({ subreddit: props.subreddit });
    if (!redditPost) return null;

    return (
        <Fragment>
            <MetaTags redditPost={redditPost} />
            <div class="loading">
                <Loader />
            </div>
            <Redirect to={redditPost.permalink} replace={true} />
        </Fragment>
    );
};
