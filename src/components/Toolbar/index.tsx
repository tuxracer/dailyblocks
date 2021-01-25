import { FunctionalComponent, h, Fragment } from "preact";
import { usePost } from "../../hooks/reddit";

interface ToolbarProps {
    subreddit: string;
    postId?: string;
}

export const Toolbar: FunctionalComponent<ToolbarProps> = ({
    subreddit,
    postId
}) => {
    const { data: redditPost, error, isLoading } = usePost({
        id: postId,
        subreddit
    });

    const isLoadedSuccessfully = !error && !isLoading;

    return (
        <Fragment>
            <div class="subredditFilter">
                {isLoadedSuccessfully && subreddit}
            </div>
            <div>{redditPost?.title}</div>
        </Fragment>
    );
};
