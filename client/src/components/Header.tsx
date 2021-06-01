import React from "react";
import { Link } from "react-router-dom";
import { checkAuth } from "../utils/auth";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import { UserType } from "../types";

export default function Header(props: {authenticated: boolean, user: UserType | undefined, handleNotAuthenticated: () => void, loading: boolean}) {
    const { authenticated, user, handleNotAuthenticated, loading } = props;

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
            <Navbar.Brand as={Link} to="/">
                <img
                    alt=""
                    src="/logo192.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                Brown Climbing{' '}
                <Badge variant="primary">In Development</Badge>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <NavDropdown title="About" id="collasible-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/about">About Us</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="#staff">Staff</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="#history">History</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="#something">Something</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
                </Nav>
                <Nav style={{marginRight:'2%'}}>
                    {loading ? (
                        <Navbar.Text>
                            Loading...
                        </Navbar.Text>
                    ) : (
                        <UserNavDropdown 
                            authenticated={authenticated}
                            user={user}
                            handleLogoutClick={handleLogoutClick}
                            handleLoginClick={handleLoginClick}
                        />
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

function UserNavDropdown(props: {authenticated: boolean, user: UserType | undefined, handleLogoutClick: () => void, handleLoginClick: () => void}) {
    const { authenticated, user, handleLogoutClick, handleLoginClick } = props;

    return (
        <>
            {authenticated ? (
                <NavDropdown id="collasible-nav-dropdown" data-display="static" className="dropdown-menu-lg-right" title={
                    <span>
                        {user?.displayName}{' '}
                        <img width="30" height="30" className="img-profile rounded-circle" alt="profile"
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" /> {/* TODO: Implement profile pics. This is a placeholder */}
                    </span>
                }>
                    <NavDropdown.Item onClick={checkAuth}>Check Auth</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogoutClick}>Logout</NavDropdown.Item>
                </NavDropdown>
            ) : (
                <Nav.Link onClick={handleLoginClick}>Login</Nav.Link>
            )}
        </>
    );
}
