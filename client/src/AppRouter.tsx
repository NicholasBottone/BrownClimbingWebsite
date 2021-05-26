import React from "react";
import { IProps } from "./App"
import { BrowserRouter as Router, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import PrivacyPage from "./components/PrivacyPage";

export default function AppRouter(props: IProps) {
    const { authenticated, user } = props;

    return (
        <Router>
            <Route exact path="/" component={() => 
                <HomePage authenticated={authenticated} user={user}/>
            }/>
            <Route exact path="/about" component={AboutPage}/>
            <Route exact path="/privacy" component={PrivacyPage}/>
        </Router>
    );
}
