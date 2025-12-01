import { REDDIT_URL } from "../../consts";
import { useComments } from "../../hooks/useRedditComments";

interface CommentsProps {
    permalink: string;
}

export const Comments = ({ permalink }: CommentsProps) => {
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
        <div className="space-y-4 text-sm">
            {comments.data.map((comment) => {
                const isLastComment =
                    comments.data &&
                    comment === comments.data[comments.data.length - 1];
                const commentUrl = REDDIT_URL + comment.permalink;
                return (
                    <div
                        key={comment.id}
                        className={`space-y-2 ${isLastComment ? "" : "border-b border-gray-200 pb-2"}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {comment.author}
                            </span>
                        </div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: comment.bodyHtml,
                            }}
                        />
                        {!!comment.numReplies && (
                            <a
                                href={commentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {comment.numReplies}{" "}
                                {comment.numReplies === 1 ? "reply" : "replies"}
                            </a>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
