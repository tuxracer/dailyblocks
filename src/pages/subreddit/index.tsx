import { Fragment, FunctionalComponent, h } from "preact";
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
        <Fragment>
            <header>
                <h1>{subreddit}</h1>
            </header>
            <section class="subreddit">
                <nav>
                    <Thumbnails subreddit={subreddit} />
                </nav>
                <main>Player</main>
                <aside>Comments</aside>
            </section>
        </Fragment>
    );
};

export { Subreddit };

export default Subreddit;
