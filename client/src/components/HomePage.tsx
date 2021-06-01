import React, { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/esm/Spinner";

import { UserType } from "../types";

export default function HomePage(props: {
    authenticated: boolean;
    user: UserType | undefined;
    loading: boolean;
}) {
    const { authenticated, user, loading } = props;

    return (
        <div>
            <Container className="p-3 text-center">
                <AlertDismissible />
                <Jumbotron>
                    <h1>Brown Climbing</h1>
                    <br />
                    <br />
                    {loading ? (
                        <div>
                            <Spinner animation="border" role="status"/>
                            <p>Loading...</p>
                        </div> // don't show user info until loading from backend is done
                    ) : (
                        <WelcomeMessage authenticated={authenticated} user={user}/>
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}

function WelcomeMessage(props: {authenticated: boolean, user: UserType | undefined}) {
    const { authenticated, user } = props;

    return (
        <>
            {authenticated ? (
                <div>
                    <h2>Welcome {user?.displayName}!</h2>
                    <h3>You have logged in successfully!</h3>
                </div>
            ) : (
                <div>
                    <h2>Welcome unauthenticated user!</h2>
                    <h3>You are not currently logged in!</h3>
                </div>
            )}
        </>
    );
}

function AlertDismissible() {
    const [show, setShow] = useState(true);

    if (show) {
        return (
            <Alert variant="warning" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>🚧 Under construction! 🏗</Alert.Heading>
                <p>
                    👷 Heads up! This website is being actively developed by the
                    Full Stack at Brown team, and is not currently completed.
                    <br />
                    <a href="https://github.com/NicholasBottone/BrownClimbingWebsite/projects/1">
                        Watch our progress!
                    </a>
                </p>
            </Alert>
        );
    }
    return <></>;
}
