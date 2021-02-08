import { FunctionalComponent, h, Fragment } from "preact";
import { isiPhone } from "../../common/helpers";
import { usePost } from "../../hooks/reddit";
import { playNext } from "../Thumbnails";

interface ToolbarProps {
    subreddit: string;
    postId?: string;
}

export const Toolbar: FunctionalComponent<ToolbarProps> = ({
    subreddit,
    postId
}) => {
    const toggleFullscreen = () => {
        const isFullscreen = !!document.fullscreenElement;
        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    };

    const { data: redditPost, error, isLoading } = usePost({
        id: postId,
        subreddit
    });

    const isLoadedSuccessfully = !error && !isLoading;

    const isFullscreenPossible =
        !isiPhone() && !!document.documentElement.requestFullscreen;

    return (
        <Fragment>
            <div class="subredditFilter" onClick={playNext}>
                {isLoadedSuccessfully && subreddit}
            </div>
            <div>{redditPost?.title}</div>
            <div class="icons">
                {isFullscreenPossible && (
                    <button onClick={toggleFullscreen}>
                        <img src="/assets/fullscreen.svg" />
                    </button>
                )}
            </div>
        </Fragment>
    );
};
