import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { usePost } from "../../hooks/reddit";

interface ToolbarProps {
    subreddit: string;
    postId?: string;
}

const Toolbar: FunctionalComponent<ToolbarProps> = ({ subreddit, postId }) => {
    const { data: redditPost, error, isLoading } = usePost({
        id: postId,
        subreddit
    });

    return (
        <div>
            <div>{subreddit}</div>
            {!!error && <div>Error</div>}
            <div>{isLoading ? "Loading..." : redditPost?.title}</div>
        </div>
    );
};

export { Toolbar };

export default Toolbar;
