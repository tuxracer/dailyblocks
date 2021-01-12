import { FunctionalComponent, h } from "preact";
import { Route, Router, RouterOnChangeArgs } from "preact-router";

import { Redirect } from "../components/Redirect";

import { Subreddit } from "../pages/subreddit";
import NotFoundPage from "../routes/notfound";

// export default routes
//     .add("/top", "top")
//     .add("/r/:subreddit/comments/:id/:name/:unknown", "app")
//     .add("/r/:subreddit/comments/:id/:name", "app")
//     .add("/r/:subreddit/comments/:id", "app")
//     .add("/r/:subreddit", "app")
//     .add("/s/:id", "app")
//     .add("/", "app");

const App: FunctionalComponent = () => {
    let currentUrl: string;
    const handleRoute = (e: RouterOnChangeArgs) => {
        currentUrl = e.url;
    };

    return (
        <div id="app">
            <Router onChange={handleRoute}>
                <Redirect path="/" to="/r/videos" />
                <Route
                    path="/r/:subreddit/comments/:postId/:shortName?"
                    component={Subreddit}
                />
                <Route path="/r/:subreddit" component={Subreddit} />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
