import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";

export const NotFound: FunctionalComponent = () => {
    return (
        <div class="notfound">
            <Link href="/">
                <img src="/assets/empty.svg" />
            </Link>
        </div>
    );
};

export default NotFound;
