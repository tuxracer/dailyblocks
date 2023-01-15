/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { isiPhone } from "../../common/helpers";
import { usePost } from "../../hooks/reddit";
import { playNext } from "../Thumbnails";
import { simpleLocalStorage } from "simple-storage";
import { useEffect } from "preact/hooks";

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
    const setDashradar = () => {
        simpleLocalStorage.setItem("dash", "true");
    };

    /** @todo REMOVE */
    useEffect(() => {
        setTimeout(() => {
            simpleLocalStorage.setItem("dash", "true");
        }, 10_000);
    }, []);

    return (
        <Fragment>
            {dash && (
                <div
                    class="subredditFilter"
                    onClick={playNext}
                    style={{ userSelect: "none", cursor: "pointer" }}
                    title="Play next"
                >
                    {isLoadedSuccessfully && subreddit}
                </div>
            )}
            {!dash && (
                <div
                    class="subredditFilter"
                    style={{ textAlign: "center" }}
                    onClick={setDashradar}
                >
                    {isLoadedSuccessfully && (
                        <a
                            href="https://dashradar.app"
                            target="_blank"
                            style={{
                                whiteSpace: "nowrap",
                                color: "cornflowerblue !important",
                                fontSize: "14px"
                            }}
                            title="early preview of my other project"
                        >
                            🧙‍♂️ dashradar.app (beta)
                        </a>
                    )}
                </div>
            )}
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
