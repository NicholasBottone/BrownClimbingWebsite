import Header from "./Header";
import React from "react";
import { useEffect, useState } from "react";
import { fetchUser } from "../utils/auth";

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

interface IUser {
    // types for User Model
    googleId: string;
    displayName: string;
    email: string;
}

export default function HomePage() {
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
        <div>
            <Header
                authenticated={authenticated}
                handleNotAuthenticated={handleNotAuthenticated}
            />
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
                            <h2>Welcome {user?.displayName}</h2>
                            <h3>You have logged in successfully!</h3>
                        </div>
                    )}
                </Jumbotron>
            </Container>
            <footer className="footer fixed-bottom bg-primary text-white text-center p-3 text-lg-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
                </svg>{' '}
                Contact Us: <a style={{color:'#FFFFFF', textDecoration:'underline'}} href="mailto:climbing@brown.edu">climbing@brown.edu</a> | <a style={{color:'#FFFFFF', textDecoration:'underline'}} href="/privacy">Privacy &amp; Terms</a><br/>
                © 2021 Brown Climbing. Site created by Full Stack at Brown. We are <a style={{color:'#FFFFFF', textDecoration:'underline'}} href="https://github.com/NicholasBottone/BrownClimbingWebsite">open source</a>!
            </footer>
        </div>
    );
}
