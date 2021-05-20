import Header from "./Header";
import React from "react";
import { useEffect, useState } from "react";

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
        async function fetchUser() {
            try {
                const res = await fetch(
                    "http://localhost:4000/auth/login/success",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Credentials": "true",
                        },
                    }
                );
                if (res.status === 200) {
                    const resJson = await res.json();
                    setAuthenticated(true);
                    setUser(resJson.user);
                } else {
                    throw new Error("failed to authenticate user");
                }
            } catch (error) {
                console.error(error);
                setAuthenticated(false);
                setError("Failed to authenticate user");
            }
        }
        fetchUser();
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
