import { Link } from "react-router-dom";
import React from "react";

export default function Header(props: any) {
    const { authenticated } = props;

    const handleLoginClick = () => {
        window.open("http://localhost:4000/auth/google", "_self");
    };

    const handleLogoutClick = () => {
        window.open("http://localhost:4000/auth/logout", "_self");
        props.handleNotAuthenticated();
    };

    // get the user's details
    const checkAuth = () => {
        fetch("http://localhost:4000/auth/check-auth", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
            },
        })
            .then((res) => {
                if (res.status === 200) return res.json();
            })
            .then((resJson) => console.log(resJson.user))
            .catch((err) => console.error(err));
    };

    return (
        <ul className="menu">
            <li>
                <Link to="/">Home</Link>
                <button onClick={checkAuth}>Check Auth</button>
            </li>

            {authenticated ? (
                <li onClick={handleLogoutClick}>Logout</li>
            ) : (
                <li onClick={handleLoginClick}>Login</li>
            )}
        </ul>
    );
}
