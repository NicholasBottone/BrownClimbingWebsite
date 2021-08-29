import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import MyAccountPage from "./pages/MyAccountPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventRegistrationPage from "./pages/EventRegistrationPage";

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
                            loading={loading}
                        />
                    )}
                />
                <Route
                    exact
                    path="/calendar/create"
                    component={() => (
                        <CreateEventPage
                            authenticated={authenticated}
                            user={user}
                            loading={loading}
                        />
                    )}
                />
                <Route
                    exact
                    path="/calendar/edit/:eventId"
                    component={() => (
                        <EditEventPage
                            authenticated={authenticated}
                            user={user}
                            loading={loading}
                        />
                    )}
                />
                <Route
                    exact
                    path="/calendar/event/:eventId"
                    component={() => (
                        <EventDetailsPage user={user} loading={loading} />
                    )}
                />
                <Route
                    exact
                    path="/calendar/register/:eventId"
                    component={() => (
                        <EventRegistrationPage user={user} loading={loading} />
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
