import { FunctionalComponent, h } from "preact";
import { usePost } from "../../hooks/reddit";
import Redirect from "../Redirect";

interface RedirectToDefaultProps {
    subreddit?: string;
}

export const RedirectToDefault: FunctionalComponent<RedirectToDefaultProps> = props => {
    const { data: redditPost } = usePost({ subreddit: props.subreddit });
    if (!redditPost) return null;

    return <Redirect to={redditPost.permalink} replace={true} />;
};
