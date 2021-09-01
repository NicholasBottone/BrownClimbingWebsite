import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";

import { UserType } from "../types";
import { handleLoginClick } from "../utils/auth";

export default function MyAccountPage(props: {
    authenticated: boolean;
    user: UserType | undefined;
    loading: boolean;
}) {
    const { authenticated, user, loading } = props;

    if (!loading && !authenticated) {
        // unauthenticated users are redirected to login page
        handleLoginClick();
        return <></>;
    }

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>My Account</h1>
                    <br />
                    {loading || !user ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <UserAccountProfile user={user} />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}

function UserAccountProfile(props: { user: UserType | undefined }) {
    const { user } = props;

    if (!user) {
        return <></>;
    }

    return (
        <div>
            <Image
                roundedCircle
                width="200"
                height="200"
                alt="profile"
                src={user.displayPictureURL}
            />
            <br />
            <br />
            <p>
                Display Name: <b>{user.displayName}</b>
                <br />
                Email address: <b>{user.email}</b>
                <br />
                Member since: <b>{new Date(user.createdAt).toLocaleString()}</b>
                <br />
                Last login:{" "}
                <b>{new Date(user.lastLoggedIn).toLocaleString()}</b>
                <br />
                User ID: <b>{user.googleId}</b>
                <br />
                {user.moderator ? <>You are a site moderator.</> : <></>}
                <br />
                <br />
                Your display name, user ID, email address, and profile picture
                are synced with your Google account profile.
            </p>
        </div>
    );
}
