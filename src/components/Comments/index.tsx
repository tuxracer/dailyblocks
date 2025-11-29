import { REDDIT_URL } from "../../consts";
import { useComments } from "../../hooks/useRedditComments";

interface CommentsProps {
    permalink: string;
}

export const Comments = ({ permalink }: CommentsProps) => {
    const commentUrl = REDDIT_URL + permalink;

    const comments = useComments(permalink);

    if (comments.isLoading) {
        return null;
    }

    if (comments.error) {
        return <div>Error loading comments: {comments.error.message}</div>;
    }

    if (!comments.data) {
        return <div>No comments found</div>;
    }

    return (
        <div className="space-y-4">
            {comments.data.map((comment) => (
                <div key={comment.id}>
                    <div
                        dangerouslySetInnerHTML={{ __html: comment.bodyHtml }}
                    />
                    <a
                        href={commentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {comment.numReplies}{" "}
                        {comment.numReplies === 1 ? "reply" : "replies"}
                    </a>
                </div>
            ))}
        </div>
    );
};
