import { FunctionalComponent, h } from "preact";
import { URLS } from "../../../../common/consts";
import RedditComment from "../../../../models/RedditComment";

interface CommentProps {
    redditComment: RedditComment;
}

export const Comment: FunctionalComponent<CommentProps> = ({
    redditComment
}) => {
    const { author, bodyHtml, numReplies, permalink } = redditComment;
    const commentUrl = URLS.REDDIT + permalink;

    console.log({ numReplies });

    return (
        <article class="comment">
            <header>{author}</header>
            <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            {!!numReplies && (
                <a
                    href={commentUrl}
                    class="more"
                    target="_blank"
                    rel="noopener"
                >
                    {numReplies} {numReplies === 1 ? "reply" : "replies"}
                </a>
            )}
        </article>
    );
};
