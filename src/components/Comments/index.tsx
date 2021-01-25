import { Fragment, FunctionalComponent, h } from "preact";
import { useComments } from "../../hooks/reddit";
import { Comment } from "./components/Comment";

interface CommentsProps {
    permalink: string;
}

export const Comments: FunctionalComponent<CommentsProps> = ({ permalink }) => {
    const { data: redditComments, error, isLoading } = useComments(permalink);

    return (
        <Fragment>
            {!!error && "Unable to load comments"}
            {/* {isLoading && "Loading comments..."} */}
            {redditComments?.map(redditComment => (
                <Comment redditComment={redditComment} />
            ))}
        </Fragment>
    );
};
