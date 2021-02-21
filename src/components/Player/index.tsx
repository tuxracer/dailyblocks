import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useState, useRef } from "preact/compat";
import { usePost } from "../../hooks/reddit";
import ReactPlayer from "react-player";
import { PLAYER_CONFIG } from "../../common/consts";
import { MetaTags } from "../MetaTags";
import { Loader } from "../Loader";
import { playNext, scrollToActiveEl } from "../Thumbnails";
import { addWatched } from "../../common/helpers";

const PLAY_NEXT_TIMEOUT_MS = 5000;

const Loading: FunctionalComponent = () => (
    <span class="player">
        <div class="loading">
            <Loader />
        </div>
    </span>
);

interface PlayerProps {
    postId?: string;
    subreddit?: string;
    autoPlayNext?: boolean;
}

export const Player: FunctionalComponent<PlayerProps> = ({
    postId,
    subreddit,
    autoPlayNext = false
}) => {
    const { data: redditPost, error, isLoading } = usePost({
        id: postId,
        subreddit
    });

    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const videoPlayerRef = useRef<ReactPlayer | null>(null);

    const playAudio = () => audioPlayerRef.current?.play();
    const pauseAudio = () => audioPlayerRef.current?.pause();

    const getPlayerCurrentTime = (playerType: "audio" | "video") => {
        if (playerType === "audio") {
            return audioPlayerRef.current?.currentTime ?? null;
        }
        if (playerType === "video") {
            return videoPlayerRef.current?.getCurrentTime() ?? null;
        }

        throw new Error("unknown player type");
    };

    const [isExternalAudio, setIsExternalAudio] = useState(
        !redditPost?.audioUrl
    );

    const [isAudioReady, setIsAudioReady] = useState(!isExternalAudio);

    const [
        playNextTimeout,
        setPlayNextTimeout
    ] = useState<NodeJS.Timeout | null>(null);

    const playNextAfterDelay = () => {
        cancelPlayNextTimeout();
        setPlayNextTimeout(setTimeout(playNext, PLAY_NEXT_TIMEOUT_MS));
    };

    const cancelPlayNextTimeout = () => {
        if (!playNextTimeout) return;
        window.clearTimeout(playNextTimeout);
        setPlayNextTimeout(null);
    };

    useEffect(() => {
        scrollToActiveEl();
        setIsExternalAudio(!!redditPost?.audioUrl);
        if (redditPost?.id) addWatched(redditPost?.id);
        return cancelPlayNextTimeout;
    }, [redditPost?.permalink]);

    useEffect(() => {
        setIsAudioReady(!isExternalAudio);
    }, [isExternalAudio]);

    const handleSeek = (seconds: number) => {
        cancelPlayNextTimeout();
        if (!audioPlayerRef.current) return;
        syncAudioPlayerWithVideoPlayer(seconds);
    };

    const syncAudioPlayerWithVideoPlayer = (forceSeconds?: number) => {
        const audioPlayerCurrentTime = getPlayerCurrentTime("audio");
        const videoPlayerCurrentTime =
            forceSeconds || getPlayerCurrentTime("video");

        if (audioPlayerCurrentTime === null || videoPlayerCurrentTime === null)
            return;

        if (
            Math.round(videoPlayerCurrentTime) ===
            Math.round(audioPlayerCurrentTime)
        ) {
            return;
        }

        console.log("syncing audio", {
            videoPlayerCurrentTime,
            audioPlayerCurrentTime
        });

        if (audioPlayerRef.current)
            audioPlayerRef.current.currentTime = videoPlayerCurrentTime;
    };

    const handlePlay = () => {
        playAudio();
        cancelPlayNextTimeout();
    };

    const handleEnded = () => {
        if (autoPlayNext) playNextAfterDelay();
    };

    if (!!error) return <Fragment>Error loading video</Fragment>;

    if (isLoading) return <Loading />;

    if (!redditPost) return null;

    return (
        <Fragment>
            <MetaTags redditPost={redditPost} />
            {isAudioReady ? (
                <ReactPlayer
                    class="player"
                    ref={videoPlayerRef}
                    url={redditPost?.mediaUrl}
                    playing={true}
                    controls={true}
                    height="100%"
                    width="100%"
                    onPlay={handlePlay}
                    onBuffer={pauseAudio}
                    onBufferEnd={playAudio}
                    onPause={pauseAudio}
                    onEnded={handleEnded}
                    onError={handleEnded}
                    onProgress={({ playedSeconds }) => {
                        syncAudioPlayerWithVideoPlayer(playedSeconds);
                    }}
                    onSeek={handleSeek}
                    config={PLAYER_CONFIG}
                    playsinline={true}
                    pip={true}
                />
            ) : (
                <Loading />
            )}

            {isExternalAudio && (
                <audio
                    class="hidden"
                    ref={audioPlayerRef}
                    onCanPlay={() => setIsAudioReady(true)}
                    preload="auto"
                    src={redditPost.audioUrl}
                    controls={true}
                    onError={() => {
                        setIsExternalAudio(false);
                    }}
                />
            )}
        </Fragment>
    );
};
