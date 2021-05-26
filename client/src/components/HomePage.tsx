import React, { useState } from "react";

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Alert from "react-bootstrap/Alert";

import { IUser } from "../App"

interface IProps {
    authenticated: boolean,
    user: IUser | undefined
}

export default function HomePage(props: IProps) {
    const { authenticated, user } = props;

    return (
        <div>
            <Container className="p-3 text-center">
                <AlertDismissibleExample/>
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

function AlertDismissibleExample() {
    const [show, setShow] = useState(true);
  
    if (show) {
      return (
        <Alert variant="warning" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>🚧 Under construction! 🏗</Alert.Heading>
          <p>
            👷 Heads up! This website is being actively developed by the Full Stack at Brown team, and is not currently completed.
            <br/><a href="https://github.com/NicholasBottone/BrownClimbingWebsite/projects/1">Watch our progress!</a>
          </p>
        </Alert>
      );
    }
    return <></>;
  }
