import { get, unescape } from "lodash";

export class RedditComment {
    id: string;

    createdAt: Date;

    replies: any;

    bodyHtml: string;

    author: string;

    permalink: string;

    numReplies: number;

    constructor(props: any) {
        props.body_html = unescape(props.body_html);

        this.id = props.id;
        this.bodyHtml = props.body_html.replace(
            '<a href="',
            '<a rel="nofollow noindex noopener" target="_blank" href="',
        );
        this.author = props.author;
        this.permalink = props.permalink;
        this.numReplies = get(props, "replies.data.children", []).length;
        this.createdAt = new Date(props.created_utc * 1_000);
    }
}

export default RedditComment;
