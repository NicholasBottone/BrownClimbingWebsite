import { Link } from "react-router-dom";
import React from "react";
import { checkAuth } from "../utils/auth";

export default function Header(props: any) {
    const { authenticated } = props;

    const handleLoginClick = () => {
        window.open(
            `${process.env.REACT_APP_API_BASE_URL}/auth/google`,
            "_self"
        );
    };

    const handleLogoutClick = () => {
        window.open(
            `${process.env.REACT_APP_API_BASE_URL}/auth/logout`,
            "_self"
        );
        props.handleNotAuthenticated();
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
