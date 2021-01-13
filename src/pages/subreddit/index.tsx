import { FunctionalComponent, h } from "preact";
import { Player } from "../../components/Player";
import { Thumbnails } from "../../components/Thumbnails";
import { AppStateContextProvider } from "../../contexts/AppStateContext";

interface SubredditProps {
    subreddit?: string;
    postId?: string;
}

const Subreddit: FunctionalComponent<SubredditProps> = ({
    subreddit = "videos",
    postId
}) => {
    return (
        <AppStateContextProvider subreddit={subreddit} activePostId={postId}>
            <header>
                <h1>{subreddit}</h1>
            </header>
            <section class="subreddit">
                <nav>
                    <Thumbnails />
                </nav>
                <main>
                    <Player />
                </main>
                <aside>Comments</aside>
            </section>
        </AppStateContextProvider>
    );
};

export { Subreddit };

export default Subreddit;
