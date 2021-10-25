import React, { useEffect, useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import { EventType, UserType } from "../types";
import { Link, Redirect } from "react-router-dom";
import { fetchEvents, fetchUsers } from "../utils/admin";
import { deleteEvent } from "../utils/calendar";

export default function AdminPage(props: {
    user: UserType | undefined;
    loading: boolean;
}) {
    const { user, loading } = props;

    if (!loading && !user?.moderator) {
        // unauthorized users are redirected to home page
        return <Redirect to="/" />;
    }

    return (
        <Container className="p-3 text-center">
            <Jumbotron>
                <h1>Admin Panel</h1>
                <br />
                {loading || !user ? (
                    <div>
                        <Spinner animation="border" role="status" />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <AdminPanel />
                )}
            </Jumbotron>
        </Container>
    );
}

function AdminPanel() {
    // the pagination buttons control the page number
    const [page, setPage] = useState(1);

    return (
        <div>
            <Pagination>
                <Pagination.Item
                    key={1}
                    active={page === 1}
                    onClick={() => setPage(1)}
                >
                    Users
                </Pagination.Item>
                <Pagination.Item
                    key={2}
                    active={page === 2}
                    onClick={() => setPage(2)}
                >
                    Events
                </Pagination.Item>
            </Pagination>
            <br />
            {page === 1 ? <UsersPanel /> : <EventsPanel />}
        </div>
    );
}

function UsersPanel() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [error, setError] = useState("Loading...");

    const UserCard = (props: { user: UserType }) => {
        const { user } = props;

        // TODO: add a button to ban the user

        return (
            <Card>
                <Card.Img variant="top" src={user.displayPictureURL} />
                <Card.Body>
                    <Card.Title>{user.displayName}</Card.Title>
                    <Card.Text>
                        {user.email}
                        <br />
                        Member since:{" "}
                        {new Date(user.createdAt).toLocaleString()}
                        <br />
                        Last logged in:{" "}
                        {new Date(user.lastLoggedIn).toLocaleString()}
                        <br />
                        {user.moderator ? "Moderator" : "User"}
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    };

    useEffect(() => {
        let mounted = true;
        fetchUsers().then((result) => {
            if (!mounted) return;
            if (typeof result === "string") {
                setError(result);
            } else {
                setUsers(result);
                setError("");
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    if (error) {
        return (
            <div>
                <Spinner animation="border" role="status" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <CardColumns>
            {users.map((user) => (
                <UserCard key={user.googleId} user={user} />
            ))}
        </CardColumns>
    );
}

function EventsPanel() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [error, setError] = useState("Loading...");

    const EventCard = (props: { event: EventType }) => {
        const { event } = props;

        const onDeleteClick = async () => {
            if (window.confirm("Are you sure you want to delete this event?")) {
                if (await deleteEvent(event)) {
                    alert("Event deleted!");
                }
            }
        };

        return (
            <Card>
                <Card.Body>
                    <Card.Title>{event.eventTitle}</Card.Title>
                    <Card.Text>{event.hostUser.displayName}</Card.Text>
                    <ButtonGroup>
                        <Button
                            as={Link}
                            to={`/calendar/event/${event._id}`}
                            variant="primary"
                        >
                            View
                        </Button>
                        <Button
                            as={Link}
                            to={`/calendar/edit/${event._id}`}
                            variant="warning"
                        >
                            Edit
                        </Button>
                        <Button variant="danger" onClick={onDeleteClick}>
                            Delete
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        );
    };

    useEffect(() => {
        let mounted = true;
        fetchEvents().then((result) => {
            if (!mounted) return;
            if (typeof result === "string") {
                setError(result);
            } else {
                setEvents(result);
                setError("");
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    if (error) {
        return (
            <div>
                <Spinner animation="border" role="status" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <CardColumns>
            {events.map((event) => (
                <EventCard key={event._id} event={event} />
            ))}
        </CardColumns>
    );
}
