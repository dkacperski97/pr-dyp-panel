import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import PageEditor from "./pages/PageEditor/PageEditor";
import SiteInitializer from "./pages/SiteInitializer/SiteInitializer";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const App: React.FC = () => {
    return (
        <DndProvider backend={HTML5Backend}>
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
        </DndProvider>
    );
};

export default App;
