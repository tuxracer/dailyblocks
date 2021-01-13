import { Fragment, FunctionalComponent, h } from "preact";
import { useState, useContext, useEffect } from "preact/compat";
import ReactPlayer from "react-player";
import { PLAYER_CONFIG } from "../../common/consts";
import { AppStateContext } from "../../contexts/AppStateContext";

const Player: FunctionalComponent = () => {
    const { activePostResource, setIsPlaying } = useContext(AppStateContext)!;

    const { data: redditPost, error, isLoading } = activePostResource;

    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [isVideoBuffering, setIsVideoBuffering] = useState(true);
    const [audioPlayerRef, setAudioPlayerRef] = useState<ReactPlayer | null>(
        null
    );
    const [videoPlayerRef, setVideoPlayerRef] = useState<ReactPlayer | null>(
        null
    );

    if (!!error) return <Fragment>Error loading video</Fragment>;

    if (!!isLoading) return <Fragment>Loading video...</Fragment>;

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

    useEffect(() => {
        setIsPlaying(isVideoPlaying);
    }, [isVideoPlaying]);

    return (
        <Fragment>
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

export { Player };

export default Player;
