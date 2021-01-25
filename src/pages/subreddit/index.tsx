import { Fragment, FunctionalComponent, h } from "preact";
import { Player } from "../../components/Player";
import { Thumbnails } from "../../components/Thumbnails";
import { Toolbar } from "../../components/Toolbar";

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
                <Toolbar postId={postId} subreddit={subreddit} />
            </header>
            <section class="subreddit">
                <aside>Comments</aside>
                <main>
                    <Player postId={postId} subreddit={subreddit} />
                </main>
                <nav>
                    <Thumbnails subreddit={subreddit} />
                </nav>
            </section>
        </Fragment>
    );
};

export { Subreddit };

export default Subreddit;
