import React from "react";
import { Link } from "react-router-dom";
import { handleLoginClick, handleLogoutClick } from "../utils/auth";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import Image from "react-bootstrap/esm/Image";

import { UserType } from "../types";

export default function Header(props: {
    authenticated: boolean;
    user: UserType | undefined;
    loading: boolean;
}) {
    const { authenticated, user, loading } = props;

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand as={Link} to="/">
                <img
                    alt=""
                    src="/logo192.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{" "}
                Brown Climbing <Badge variant="primary">In Development</Badge>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">
                        Home
                    </Nav.Link>
                    <NavDropdown title="About" id="collasible-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/about">
                            About Us
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="#staff">
                            Staff
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="#history">
                            History
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="#something">
                            Something
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to="/calendar">
                        Calendar
                    </Nav.Link>
                </Nav>
                <Nav style={{ marginRight: "2%" }}>
                    {loading ? (
                        <Navbar.Text>Loading...</Navbar.Text>
                    ) : (
                        <UserNavDropdown
                            authenticated={authenticated}
                            user={user}
                        />
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

function UserNavDropdown(props: {
    authenticated: boolean;
    user: UserType | undefined;
}) {
    const { authenticated, user } = props;

    return (
        <>
            {authenticated ? (
                <NavDropdown
                    id="collasible-nav-dropdown"
                    data-display="static"
                    className="dropdown-menu-lg-right"
                    title={
                        <span>
                            {user?.displayName}{" "}
                            <Image
                                width="30"
                                height="30"
                                roundedCircle
                                alt="profile"
                                src={
                                    user?.displayPictureURL ||
                                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                                }
                            />{" "}
                        </span>
                    }
                >
                    <NavDropdown.Item as={Link} to="/myaccount">
                        My Account
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogoutClick}>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            ) : (
                <Nav.Link onClick={handleLoginClick}>Login</Nav.Link>
            )}
        </>
    );
}
