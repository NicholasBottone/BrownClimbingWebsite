import React from "react";
import { useEffect, useState } from "react";
import { fetchUser } from "./utils/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import PrivacyPage from "./components/PrivacyPage";
import NotFoundPage from "./components/NotFoundPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

export interface IUser {
    // types for User Model
    googleId: string,
    displayName: string,
    email: string
}

export interface IProps {
    authenticated: boolean,
    user: IUser | undefined
}

export default function App() {
    const [user, setUser] = useState<IUser>();
    const [, setError] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

    // called once when components on page have rendered
    useEffect(() => {
        fetchUser(setAuthenticated, setUser, setError);
    }, []);

    const handleNotAuthenticated = () => {
        setAuthenticated(false);
    };

    return (
        <Router>
            <Header
                authenticated={authenticated}
                user={user}
                handleNotAuthenticated={handleNotAuthenticated}
            />

            <Switch>

                <Route exact path="/" component={() => 
                    <HomePage authenticated={authenticated} user={user}/>
                }/>
                <Route exact path="/about" component={AboutPage}/>
                <Route exact path="/privacy" component={PrivacyPage}/>

                <Route path="*" component={NotFoundPage}/>

            </Switch>

            <Footer />
        </Router>
    );
}
