import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";

import { BasicUserType, EventType, UserType } from "../types";
import { fetchEvent } from "../utils/calendar";

export default function EventDetailsPage(props: {
    user: UserType | undefined;
    loading: boolean;
}) {
    const { user, loading } = props;
    const eventId: string = useParams();

    const [event, setEvent] = useState<EventType>();
    const [error, setError] = useState("Loading event data...");

    // called once when components on page have rendered
    useEffect(() => {
        if (loading) return;
        let mounted = true;
        fetchEvent(eventId).then((result) => {
            if (!mounted) return;
            if (typeof result === "string") {
                setError(result);
            } else {
                setEvent(result);
            }
        });
        return () => {
            mounted = false;
        };
    }, [loading, eventId]);

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>{event?.eventTitle || "Brown Climbing Event"}</h1>
                    <h3>Event Details</h3>
                    <br />
                    <br />
                    {loading || event == null ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>{error}</p>
                        </div>
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
                <Card.Text>
                    Registrants:
                    {event.registeredUsers.map((u) => (
                        <>
                            <br />
                            u.displayName
                        </>
                    ))}
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

        return (
            <Button
                as={Link}
                to={`/calendar/register/${event._id}`}
                variant={isRegistered ? "danger" : "success"}
                disabled={
                    isRegistered ||
                    event.registeredUsers.length >= event.maxCapacity
                }
            >
                {isRegistered ? "Unregister" : "Register"}
            </Button>
        );
    }
}
