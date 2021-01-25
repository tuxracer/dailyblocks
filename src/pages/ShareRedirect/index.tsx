import { FunctionalComponent, h } from "preact";
import { Redirect } from "../../components/Redirect";
import { usePost } from "../../hooks/reddit";

interface ShareRedirectProps {
    postId: string;
}

export const ShareRedirect: FunctionalComponent<ShareRedirectProps> = ({
    postId
}) => {
    const { data: redditPost } = usePost({ id: postId });
    if (!redditPost) return null;

    return <Redirect to={redditPost.permalink} />;
};
