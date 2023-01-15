/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { isiPhone } from "../../common/helpers";
import { usePost } from "../../hooks/reddit";
import { playNext } from "../Thumbnails";
import { simpleLocalStorage } from "simple-storage";

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

    /** @todo REMOVE */
    const dash = simpleLocalStorage.getItem("dash") as string;

    /** @todo REMOVE */
    const gotoDashradar = () => {
        simpleLocalStorage.setItem("dash", "true");
    };

    return (
        <Fragment>
            <div class="subredditFilter" onClick={playNext}>
                {isLoadedSuccessfully && subreddit}
            </div>
            <div>
                {redditPost?.title}
                {!dash && (
                    <span onClick={gotoDashradar}>
                        &nbsp;|&nbsp;
                        <a href="https://dashradar.app" target="_blank">
                            [ dashradar.app (early beta) ]
                        </a>
                    </span>
                )}
            </div>
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
