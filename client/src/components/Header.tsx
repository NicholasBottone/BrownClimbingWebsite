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
    user: UserType | undefined;
    loading: boolean;
}) {
    const { user, loading } = props;

    return (
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
            <Navbar.Brand as={Link} to="/">
                <img
                    alt="logo"
                    src="https://i.ibb.co/Cmj09tc/logo192.webp"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{" "}
                Brown Climbing <Badge variant="primary">Beta</Badge>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">
                        Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/calendar">
                        Calendar
                    </Nav.Link>
                </Nav>
                <Nav style={{ marginRight: "2%" }}>
                    {loading ? (
                        <Navbar.Text>Loading...</Navbar.Text>
                    ) : (
                        <UserNavDropdown user={user} />
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

function UserNavDropdown(props: { user: UserType | undefined }) {
    const { user } = props;

    const AdminPanelItem = () => {
        return user?.moderator ? (
            <NavDropdown.Item as={Link} to="/admin">
                Admin Panel
            </NavDropdown.Item>
        ) : (
            <></>
        );
    };

    return (
        <>
            {user ? (
                <NavDropdown
                    id="collapsible-nav-dropdown"
                    data-display="static"
                    className="dropdown-menu-lg-right"
                    title={
                        <span>
                            {user.displayName}{" "}
                            <Image
                                width="30"
                                height="30"
                                roundedCircle
                                alt="profile"
                                src={user.displayPictureURL}
                            />{" "}
                        </span>
                    }
                >
                    <NavDropdown.Item as={Link} to="/myaccount">
                        My Account
                    </NavDropdown.Item>
                    <AdminPanelItem />
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
