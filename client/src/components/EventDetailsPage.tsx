import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";

import { BasicUserType, EventType, UserType } from "../types";
import {
    fetchEvent,
    registerForEvent,
    unregisterForEvent,
} from "../utils/calendar";

export default function EventDetailsPage(props: {
    authenticated: boolean;
    user: UserType | undefined;
    loading: boolean;
}) {
    const { authenticated, user, loading } = props;
    const eventId: string = useParams();

    const [event, setEvent] = useState<EventType>();
    const [error, setError] = useState("Loading event data...");

    // called once when components on page have rendered
    useEffect(() => {
        // FIXME: look into why this is called multiple times per page load
        fetchEvent(eventId, setEvent, setError);
    }, [eventId]);

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>
                        {event?.eventTitle || "Brown Climbing Event Details"}
                    </h1>
                    <br />
                    <br />
                    {loading || event == null ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>{error}</p>
                        </div> // don't show user info until loading from backend is done
                    ) : (
                        <EventDetails event={event} user={user} />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}
function EventDetails(props: { event: EventType; user: UserType | undefined }) {
    const { event, user } = props;

    return (
        <Card>
            <Card.Body>
                <Card.Title>{event.eventTitle}</Card.Title>
                <Card.Subtitle>
                    Hosted by {event.hostUser.displayName}
                </Card.Subtitle>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text>
                    Location: {event.location}
                    <br />
                    Event starts at {event.startTime.toLocaleString()}
                    <br />
                    Transport via {event.transportInfo}
                    <br />
                    Registered: {event.registeredUsers.length}/
                    {event.maxCapacity}
                </Card.Text>
                {user != null ? <RegisteredUserEventOptions /> : <></>}
            </Card.Body>
        </Card>
    );

    function RegisteredUserEventOptions() {
        return (
            <>
                {event.hostUser.googleId === user?.googleId ? (
                    <Button
                        variant="warning"
                        as={Link}
                        to={`/calendar/edit/${event._id}`}
                    >
                        Edit Event
                    </Button>
                ) : (
                    <RegisterButton />
                )}
            </>
        );
    }

    function RegisterButton() {
        const isRegistered = event.registeredUsers.some(
            (registrant: BasicUserType) =>
                registrant.googleId === user?.googleId
        );

        const register = async () => {
            if (await registerForEvent(event, user)) {
                alert(`You are now registered for ${event.eventTitle}!`);
            } else {
                console.error("Registration failed");
            }
        };
        const unregister = async () => {
            if (await unregisterForEvent(event, user)) {
                alert(`You are no longer registered for ${event.eventTitle}.`);
            } else {
                console.error("Unregistration failed");
            }
        };

        return isRegistered ? (
            <Button variant="danger" onClick={unregister}>
                Unregister
            </Button>
        ) : (
            <Button
                variant="success"
                onClick={register}
                disabled={event.registeredUsers.length >= event.maxCapacity}
            >
                Register
            </Button>
        );
    }
}
