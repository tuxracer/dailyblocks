import { FunctionalComponent, h } from "preact";
import Thumbnails from "../../components/Thumbnails";

interface SubredditProps {
    subreddit?: string;
    postId?: string;
}

const Subreddit: FunctionalComponent<SubredditProps> = ({
    subreddit = "videos",
    postId
}) => {
    return (
        <div>
            <header>
                <h1>{subreddit}</h1>
            </header>
            <footer>
                <Thumbnails />
            </footer>
        </div>
    );
};

export { Subreddit };

export default Subreddit;
