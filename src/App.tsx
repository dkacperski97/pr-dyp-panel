import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";
import PageEditor from "./pages/PageEditor/PageEditor";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { StylesProvider } from '@material-ui/core/styles';

const client = new ApolloClient({
    uri: 'http://sem6:4000/graphql',
    cache: new InMemoryCache()
});

const App: React.FC = () => {
    return (
        <StylesProvider>
            <ApolloProvider client={client}>
                <DndProvider backend={HTML5Backend}>
                    <Router>
                        <Switch>
                            <Route path="/">
                                <PageEditor />
                            </Route>
                        </Switch>
                    </Router>
                </DndProvider>
            </ApolloProvider>
        </StylesProvider>
    );
};

export default App;
