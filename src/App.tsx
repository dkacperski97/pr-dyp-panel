import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import PageEditor from "./pages/PageEditor/PageEditor";
import SiteInitializer from "./pages/SiteInitializer/SiteInitializer";

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/init" />
                </Route>
                <Route path="/init">
                    <SiteInitializer />
                </Route>
                <Route path="/pages">
                    <PageEditor />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
