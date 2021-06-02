import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./components/HomePage";
import CalendarPage from "./components/CalendarPage";
import AboutPage from "./components/AboutPage";
import PrivacyPage from "./components/PrivacyPage";
import NotFoundPage from "./components/NotFoundPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MyAccountPage from "./components/MyAccountPage";

import { fetchUser } from "./utils/auth";
import { UserType } from "./types";

export default function App() {
    const [user, setUser] = useState<UserType>();
    const [, setError] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // called once when components on page have rendered
    useEffect(() => {
        async function getUser() {
            await fetchUser(setAuthenticated, setUser, setError);
            setLoading(false);
        }
        getUser();
    }, []);

    return (
        <Router>
            <Header
                authenticated={authenticated}
                user={user}
                loading={loading}
            />

            <Switch>
                <Route
                    exact
                    path="/"
                    component={() => (
                        <HomePage
                            authenticated={authenticated}
                            user={user}
                            loading={loading}
                        />
                    )}
                />
                <Route
                    exact
                    path="/calendar"
                    component={() => (
                        <CalendarPage
                            authenticated={authenticated}
                            user={user}
                        />
                    )}
                />
                <Route
                    exact
                    path="/myaccount"
                    component={() => (
                        <MyAccountPage
                            authenticated={authenticated}
                            user={user}
                            loading={loading}
                        />
                    )}
                />
                <Route exact path="/about" component={AboutPage} />
                <Route exact path="/privacy" component={PrivacyPage} />

                <Route path="*" component={NotFoundPage} />
            </Switch>

            <Footer />
        </Router>
    );
}
