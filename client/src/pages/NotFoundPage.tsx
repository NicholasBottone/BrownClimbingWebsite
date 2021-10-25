import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link, useLocation } from "react-router-dom";

export default function AboutPage() {
    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>404 Not Found</h1>
                    <h4>
                        <code>{useLocation().pathname}</code> does not exist
                    </h4>
                    <img
                        alt="Blueno the bear"
                        src="https://i.ibb.co/KhqZbYk/Blueno.webp"
                        width="25%"
                    />
                    <p>
                        The page you attempted to access does not exist. If you
                        believe this is an error, contact the website
                        administrators.
                    </p>
                    <Button as={Link} to="/" variant="primary">
                        Return Home
                    </Button>
                </Jumbotron>
            </Container>
        </div>
    );
}
