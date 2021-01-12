import { FunctionalComponent, h } from "preact";
import { Suspense } from "preact/compat";
import { useSubreddit } from "../../hooks/reddit";

interface SubredditProps {
    subreddit?: string;
    postId?: string;
}

const Subreddit: FunctionalComponent<SubredditProps> = ({
    subreddit = "videos",
    postId
}) => {
    const { data, error, isLoading } = useSubreddit(subreddit);

    if (isLoading) return <h1>Loading...</h1>;

    if (error) return <h1>Error!</h1>;

    console.log({ data, isLoading, error });

    return (
        <header>
            <h1>
                {subreddit} {postId}
            </h1>
            <Suspense fallback="loading...">
                <h1>done!</h1>
            </Suspense>
        </header>
    );
};

export { Subreddit };

export default Subreddit;
