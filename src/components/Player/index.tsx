import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/compat";
import { usePost } from "../../hooks/reddit";
import ReactPlayer from "react-player";
import { PLAYER_CONFIG } from "../../common/consts";
import { MetaTags } from "../MetaTags";
import { playNext } from "../../common/helpers";

const PLAY_NEXT_TIMEOUT_MS = 5000;

interface PlayerProps {
    postId?: string;
    subreddit?: string;
    autoPlayNext?: boolean;
}

export const Player: FunctionalComponent<PlayerProps> = ({
    postId,
    subreddit,
    autoPlayNext = true
}) => {
    const { data: redditPost, error, isLoading } = usePost({
        id: postId,
        subreddit
    });

    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [isVideoBuffering, setIsVideoBuffering] = useState(true);
    const [audioPlayerRef, setAudioPlayerRef] = useState<ReactPlayer | null>(
        null
    );
    const [videoPlayerRef, setVideoPlayerRef] = useState<ReactPlayer | null>(
        null
    );

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
        setIsVideoPlaying(true);
        return cancelPlayNextTimeout;
    }, [redditPost?.permalink]);

    const handleSeek = (seconds: number) => {
        cancelPlayNextTimeout();
        if (!audioPlayerRef) return;
        audioPlayerRef.seekTo(seconds, "seconds");
    };

    const syncAudioPlayerWithVideoPlayer = () => {
        if (!audioPlayerRef || !videoPlayerRef) return;
        const videoPlayerCurrentTime = videoPlayerRef.getCurrentTime();
        audioPlayerRef.seekTo(videoPlayerCurrentTime, "seconds");
    };

    const handlePlay = () => {
        setIsVideoPlaying(true);
        setIsVideoBuffering(false);
        cancelPlayNextTimeout();
    };

    const handleEnded = () => {
        setIsVideoPlaying(false);
        if (autoPlayNext) playNextAfterDelay();
    };

    const handlePause = () => {
        setIsVideoPlaying(false);
    };

    const handleBuffer = () => {
        setIsVideoBuffering(true);
    };

    const handleBufferEnd = () => {
        setIsVideoBuffering(false);
        syncAudioPlayerWithVideoPlayer();
    };

    syncAudioPlayerWithVideoPlayer();

    if (!!error) return <Fragment>Error loading video</Fragment>;

    if (isLoading)
        return (
            <div class="player">
                <div class="loading">
                    <img src="/assets/loading.png" />
                </div>
            </div>
        );

    if (!redditPost) return null;

    return (
        <Fragment>
            <MetaTags redditPost={redditPost} />
            <ReactPlayer
                class="player"
                ref={setVideoPlayerRef}
                url={redditPost?.mediaUrl}
                playing={isVideoPlaying}
                controls={true}
                height="100%"
                width="100%"
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onError={handleEnded}
                onBuffer={handleBuffer}
                onBufferEnd={handleBufferEnd}
                onSeek={handleSeek}
                config={PLAYER_CONFIG}
            />
            {!!redditPost?.audioUrl && (
                <ReactPlayer
                    class="hidden"
                    ref={setAudioPlayerRef}
                    url={redditPost.audioUrl}
                    playing={isVideoPlaying}
                />
            )}
        </Fragment>
    );
};
