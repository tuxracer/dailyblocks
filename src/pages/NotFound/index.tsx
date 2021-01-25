import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import * as style from "./style.css";

export const NotFound: FunctionalComponent = () => {
    return (
        <div class={style.notfound}>
            <Link href="/">Not found</Link>
        </div>
    );
};

export default NotFound;
