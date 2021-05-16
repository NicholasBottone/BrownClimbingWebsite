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

    return (
        <ul className="menu">
            <li>
                <Link to="/">Home</Link>
            </li>
            {authenticated ? (
                <li onClick={handleLogoutClick}>Logout</li>
            ) : (
                <li onClick={handleLoginClick}>Login</li>
            )}
        </ul>
    );
}
