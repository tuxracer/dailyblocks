import { FunctionalComponent, h, Fragment } from "preact";
import { useState } from "preact/compat";
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
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const toggleFullscreen = () => {
        if (isFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
        } else {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        }
    };

    const { data: redditPost, error, isLoading } = usePost({
        id: postId,
        subreddit
    });

    const isLoadedSuccessfully = !error && !isLoading;

    return (
        <Fragment>
            <div class="subredditFilter" onClick={playNext}>
                {isLoadedSuccessfully && subreddit}
            </div>
            <div>{redditPost?.title}</div>
            <div class="icons">
                <button onClick={toggleFullscreen}>
                    <img src="/assets/fullscreen.svg" />
                </button>
            </div>
        </Fragment>
    );
};
