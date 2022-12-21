/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { Subreddit } from "../pages/subreddit";
import { NotFound } from "../pages/NotFound";
import { ShareRedirect } from "../pages/ShareRedirect";
import { RedirectToDefault } from "./RedirectToDefault";

const clearLegacy = async () => {
    try {
        await (window as any).cookieStore.delete("watched");
    } catch {}
};

clearLegacy();

export const App: FunctionalComponent = () => (
    <div id="app">
        <Router>
            <Route
                path="/r/:subreddit/comments/:postId/:shortName?"
                component={Subreddit}
            />
            <Route path="/s/:postId" component={ShareRedirect} />
            <Route path="/r/:subreddit" component={RedirectToDefault} />
            <Route path="/" component={RedirectToDefault} />

            <NotFound default />
        </Router>
    </div>
);

export default App;
