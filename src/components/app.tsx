import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { Redirect } from "../components/Redirect";
import { Subreddit } from "../pages/subreddit";
import NotFoundPage from "../routes/notfound";

const App: FunctionalComponent = () => (
    <div id="app">
        <Router>
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

export default App;
