import { get, unescape } from "lodash";
import ReactPlayer from "react-player";

export class RedditPost {
    public score: number;

    public id: string;

    public title: string;

    public subreddit: string;

    public url: string;

    public permalink: string;

    public name: string;

    public over18: boolean;

    public numComments: number;

    public thumbnailUrl: string;

    get youtubeId() {
        return (this.thumbnailUrl.split("/hqdefault").shift() || "")
            .split("/")
            .pop();
    }

    public description?: string;

    public mediaType: string;

    public mediaUrl: string;

    public audioUrl?: string;

    public isPlayable: boolean;

    public redditVideoUrl?: string;

    public redditAudioUrl?: string;

    public isWatched: boolean = false;

    constructor(json: any = {}) {
        const fallbackThumbnailUrl =
            json.thumbnail_url ||
            "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

        this.title =
            `${json.over_18 && !json.title.startsWith("NSFW ") ? "NSFW " : ""}` +
            json.title.replace(/&amp;/i, "&");
        this.id = json.id;
        this.subreddit = json.subreddit.toLowerCase();
        this.url = json.url;
        this.permalink = json.permalink;
        this.name = json.permalink.split("/")[5];
        this.over18 = json.over_18;
        this.numComments = json.num_comments;
        this.score = json.score;
        this.mediaType =
            json.media_type || (get(json, "media.type", "") as string);

        const postDataThumbnailUrl = get(json, "thumbnail", "").startsWith(
            "https",
        )
            ? json.thumbnail
            : "";

        let oEmbedThumbnail = get(json, "media.oembed.thumbnail_url", "");

        const previewImages = get(json, "preview.images", []);
        const previewImage = previewImages[0];
        const previewImageSourceUrl = get(
            previewImage,
            "source.url",
            "",
        ).replace(/&amp;/g, "&");

        this.description = json.description;

        this.redditVideoUrl = get(json, "media.reddit_video.fallback_url", "");
        this.redditAudioUrl = this.redditVideoUrl
            ? this.redditVideoUrl.split("/DASH")[0] + "/DASH_audio.mp4"
            : "";

        this.thumbnailUrl = this.redditVideoUrl
            ? previewImageSourceUrl || json.thumbnailUrl || fallbackThumbnailUrl
            : json.thumbnailUrl ||
              oEmbedThumbnail ||
              postDataThumbnailUrl ||
              previewImageSourceUrl ||
              fallbackThumbnailUrl;

        this.audioUrl = json.audio_url || this.redditAudioUrl;
        this.mediaUrl =
            json.media_url ||
            this.redditVideoUrl ||
            json.mediaUrl ||
            unescape(json.url);
        this.isPlayable = Boolean(ReactPlayer.canPlay?.(this.mediaUrl));
    }
}

export default RedditPost;
