import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { Layout } from "./Component/Pages/Layout";
import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import Login from "./Component/Pages/Login";
import HomePage from "./Component/Pages/HomePage";
import CreatePost from "./Component/Pages/CreatePost";

import { setContext } from "@apollo/client/link/context";
import ViewPost from "./Component/Pages/ViewPost";
import Registration from "./Component/Pages/Registration";

function App() {
    const httpLink = createHttpLink({
        uri: "http://localhost:4000/graphql",
    });

    const authLink = setContext((_, { headers }) => {
        const token =
            sessionStorage.getItem("token") || localStorage.getItem("token");
        return {
            headers: {
                ...headers,
                authorization: token ? token : "",
            },
        };
    });

    const wsLink = new WebSocketLink({
        uri: `ws://localhost:4000/graphql`,
        options: {
            reconnect: true,
            connectionParams: {
                authToken: localStorage.getItem("token"),
            },
        },
    });

    const link = split(
        ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return (
                kind === "OperationDefinition" && operation === "subscription"
            );
        },
        wsLink,
        authLink.concat(httpLink)
    );

    const client = new ApolloClient({
        link,
        cache: new InMemoryCache(),
    });

    return (
        <ApolloProvider client={client}>
            <Router>
                <Switch>
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Registration} />
                    <Route path="/" exact component={HomePage} />
                    <Route path="/create" exact component={CreatePost} />
                    <Route path="/view" exact component={ViewPost} />
                    <Route path="/view/:postId" exact component={ViewPost} />
                </Switch>
            </Router>
        </ApolloProvider>
    );
}

export default App;
