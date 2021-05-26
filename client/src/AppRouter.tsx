import React from "react";
import HomePage from "./components/HomePage";
import { IProps } from "./App"
import { BrowserRouter as Router, Route } from "react-router-dom";

export default function AppRouter(props: IProps) {
    const { authenticated, user } = props;

    return (
        <Router>
            <Route exact path="/" component={() => 
                <HomePage authenticated={authenticated} user={user}/>
            }/>
        </Router>
    );
}
