import { FunctionalComponent, h } from "preact";
import { useSubreddit } from "../../hooks/reddit";
import { Thumbnail } from "./components/Thumbnail";

interface SubredditProps {
    subreddit?: string;
    activePostId?: string;
}

const Thumbnails: FunctionalComponent<SubredditProps> = ({
    subreddit = "videos",
    activePostId
}) => {
    const { data, error, isLoading } = useSubreddit(subreddit);

    console.log({ subreddit, activePostId, data, error, isLoading });

    return (
        <ul>
            {isLoading && <li>Loading...</li>}
            {data?.map(redditPost => (
                <li>
                    <Thumbnail redditPost={redditPost} />
                </li>
            ))}
        </ul>
    );
};

export { Thumbnails };

export default Thumbnails;
