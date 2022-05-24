/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionalComponent, h } from "preact";
import Match from "preact-router/match";
import { Player } from "../../components/Player";
import { Thumbnails } from "../../components/Thumbnails";
import { Toolbar } from "../../components/Toolbar";
import { Comments } from "../../components/Comments";
import { BLACKLIST } from "../../common/consts";
import NotFound from "../NotFound";

interface SubredditProps {
    subreddit?: string;
    postId?: string;
}

const Subreddit: FunctionalComponent<SubredditProps> = ({
    subreddit = "videos",
    postId
}) => {
    if (BLACKLIST.includes(postId || "")) {
        return <NotFound />;
    }

    return (
        <div class="subreddit">
            <header>
                <Toolbar postId={postId} subreddit={subreddit} />
            </header>
            <section>
                <nav>
                    <Thumbnails subreddit={subreddit} />
                </nav>
                <main>
                    <Player postId={postId} subreddit={subreddit} />
                </main>
                <aside>
                    <Match path="/">
                        {({ path }: any) => <Comments permalink={path} />}
                    </Match>
                </aside>
            </section>
        </div>
    );
};

export { Subreddit };

export default Subreddit;
