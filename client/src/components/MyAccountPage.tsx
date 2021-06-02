import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/esm/Spinner";
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
        // unauthed users are redirected to homepage
        handleLoginClick();
        return <></>;
    }

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>My Account</h1>
                    <br />
                    {loading ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>Loading...</p>
                        </div> // don't show user info until loading from backend is done
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

    return (
        <div>
            <Image
                roundedCircle
                width="200"
                height="200"
                alt="profile"
                src={
                    user?.displayPictureURL ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                }
            />
            <br />
            <br />
            <p>
                Display Name: <b>{user?.displayName}</b>
                <br />
                Email address: <b>{user?.email}</b>
                <br />
                Member since: <b>{user?.memberSince}</b>
                <br />
                Last login: <b>{user?.lastLogin}</b>
                <br />
                User ID: <b>{user?.googleId}</b>
                <br />
                <br />
                Your display name, user ID, email address, and profile picture
                are synced with your Google account profile.
            </p>
        </div>
    );
}
