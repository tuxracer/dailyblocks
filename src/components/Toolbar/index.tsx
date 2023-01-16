/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { isiPhone } from "../../common/helpers";
import { usePost } from "../../hooks/reddit";
import { playNext } from "../Thumbnails";
import { simpleLocalStorage } from "simple-storage";
import { useEffect, useState } from "preact/hooks";

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
            <div
                class="subredditFilter"
                onClick={playNext}
                style={{ userSelect: "none", cursor: "pointer" }}
            >
                {isLoadedSuccessfully && subreddit + " ⏭️"}
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
