import React from "react";

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

import { IProps } from "../App"

export default function HomePage(props: IProps) {
    const { authenticated, user } = props;

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>Brown Climbing</h1>
                    <br/><br/>
                    {!authenticated ? (
                        <div>
                            <h2>Welcome unauthenticated user!</h2>
                            <h3>You are not currently logged in!</h3>
                        </div>
                    ) : (
                        <div>
                            <h2>Welcome {user?.displayName}!</h2>
                            <h3>You have logged in successfully!</h3>
                        </div>
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}
