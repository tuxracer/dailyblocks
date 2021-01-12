import { FunctionalComponent, h } from "preact";
import { usePost, useSubreddit } from "../../hooks/reddit";

interface SubredditProps {
    subreddit?: string;
    postId?: string;
}

const Subreddit: FunctionalComponent<SubredditProps> = ({
    subreddit = "videos",
    postId
}) => {
    const {
        data: redditPosts,
        error: subredditError,
        isLoading: isLoadingSubreddits
    } = useSubreddit(subreddit);

    const {
        data: redditPost,
        error: postError,
        isLoading: isLoadingPost
    } = usePost({
        id: postId,
        subreddit
    });

    console.log({ redditPosts, isLoadingSubreddits, subredditError });
    console.log({ redditPost, isLoadingPost, postError });

    return (
        <header>
            <h1>
                {subreddit} {postId}
            </h1>
        </header>
    );
};

export { Subreddit };

export default Subreddit;
