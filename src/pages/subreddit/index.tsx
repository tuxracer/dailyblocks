import { FunctionalComponent, h } from "preact";
import { Suspense, lazy } from "preact/compat";

const Subreddit: FunctionalComponent = () => {
    return (
        <header>
            <h1>Preact App</h1>
            <Suspense fallback="loading...">
                <h1>done!</h1>
            </Suspense>
        </header>
    );
};

export { Subreddit };

export default Subreddit;
