import Header from "./Header";
import React from "react";
import { useEffect, useState } from "react";
import { fetchUser } from "../utils/auth";

interface IUser {
    // types for User Model
    googleId: string;
    displayName: string;
    email: string;
}

export default function HomePage() {
    const [user, setUser] = useState<IUser>();
    const [error, setError] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

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
            <div>
                {!authenticated ? (
                    <h1>Welcome!</h1>
                ) : (
                    <div>
                        <h1>You have logged in successfully!</h1>
                        <h2>Welcome {user?.displayName}</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
