import { Fragment, FunctionalComponent, h } from "preact";
import { useState } from "preact/compat";
import { usePost } from "../../hooks/reddit";
import ReactPlayer from "react-player";
import { PLAYER_CONFIG } from "../../common/consts";
import { MetaTags } from "../MetaTags";

interface PlayerProps {
    postId?: string;
    subreddit?: string;
}

export const Player: FunctionalComponent<PlayerProps> = ({
    postId,
    subreddit
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

    if (!!error) return <Fragment>Error loading video</Fragment>;

    if (!!isLoading)
        return (
            <div class="player">
                <div class="loading">
                    <img src="/assets/loading.png" />
                </div>
            </div>
        );

    const handleSeek = (seconds: number) => {
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
    };

    const handleEnded = () => {
        setIsVideoPlaying(false);
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
