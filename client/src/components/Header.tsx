import React from "react";
import { checkAuth } from "../utils/auth";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import { IUser } from "../App"

interface IProps {
    authenticated: boolean,
    user: IUser | undefined,
    handleNotAuthenticated: () => void
}

export default function Header(props: IProps) {
    const { authenticated, user, handleNotAuthenticated } = props;

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
        handleNotAuthenticated();
    };

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">
                <img
                    alt=""
                    src="/logo192.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                Brown Climbing
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <NavDropdown title="About" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Nav.Link onClick={checkAuth}>Check Auth</Nav.Link>
                    <Nav.Link onClick={authenticated ? handleLogoutClick : handleLoginClick}>
                        {authenticated ? "Logout" : "Login"}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
