import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import * as style from "./style.css";

export const NotFound: FunctionalComponent = () => {
    return (
        <div class={style.notfound}>
            <Link href="/">
                <img src="/assets/empty.svg" />
            </Link>
        </div>
    );
};

export default NotFound;
