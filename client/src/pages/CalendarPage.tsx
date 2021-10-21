import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Image from "react-bootstrap/Image";

import { BasicUserType, EventType, UserType } from "../types";
import { fetchCalendar } from "../utils/calendar";
import { handleLoginClick } from "../utils/auth";

export default function CalendarPage(props: {
    user: UserType | undefined;
    loading: boolean;
}) {
    const { user, loading } = props;

    const [eventList, setEventList] = useState<EventType[]>();
    const [error, setError] = useState("Loading calendar data...");

    // called once when components on page have rendered
    useEffect(() => {
        if (loading) return;
        let mounted = true;
        fetchCalendar().then((result) => {
            if (!mounted) return;
            if (typeof result === "string") {
                setError(result);
            } else {
                setEventList(result);
            }
        });
        return () => {
            mounted = false;
        };
    }, [loading]);

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>Events Calendar for Brown Climbing</h1>
                    <br />
                    <br />
                    {loading || eventList == null ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <Calendar user={user} eventList={eventList} />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}

// TODO: Look into Full Calendar (https://fullcalendar.io/) and Big Calendar (https://jquense.github.io/react-big-calendar/)
// TODO: Look into embedding Google Maps (https://www.embed-map.com/)

function Calendar(props: {
    user: UserType | undefined;
    eventList: EventType[];
}) {
    const { user, eventList } = props;

    if (eventList == null) {
        return <></>;
    }

    return (
        <>
            <CardColumns style={{ columnCount: 1 }}>
                {eventList.map((event: EventType) => (
                    <EventElement key={event._id} event={event} user={user} />
                ))}
            </CardColumns>

            <br />
            <br />
            {user ? (
                <Button as={Link} to="/calendar/create" variant="primary">
                    Host an Event
                </Button>
            ) : (
                <Button onClick={handleLoginClick} variant="primary">
                    Login for the best experience
                </Button>
            )}
        </>
    );
}

function EventElement(props: { event: EventType; user: UserType | undefined }) {
    const { event, user } = props;

    return (
        <Card border="danger">
            <Card.Body>
                <Card.Title style={{ fontSize: "1.8em" }}>
                    {event.eventTitle}
                </Card.Title>
                <Card.Subtitle style={{ fontSize: "1.3em" }}>
                    Hosted by {event.hostUser.displayName}
                </Card.Subtitle>
                <Card.Text style={{ fontSize: "1.1em" }}>
                    {event.description}
                </Card.Text>
                <Card.Text style={{ fontSize: "1.1em" }}>
                    Event starts at {new Date(event.startTime).toLocaleString()}
                    <br />
                    Location: {event.location}
                    <br />
                    Transport via {event.transportInfo}
                    <br />
                    Registered: {event.registeredUsers.length}/
                    {event.maxCapacity}
                    <br />
                    {event.registeredUsers.map((u: BasicUserType) => (
                        <Image
                            roundedCircle
                            key={u.googleId}
                            src={u.displayPictureURL}
                            alt={u.displayName}
                            width="25"
                        />
                    ))}
                </Card.Text>
                <ButtonGroup>
                    <Button as={Link} to={`/calendar/event/${event._id}`}>
                        View Details
                    </Button>
                    {user != null ? <RegisteredUserEventOptions /> : <></>}
                </ButtonGroup>
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

        if (isRegistered) {
            // Unregister button
            return (
                <Button
                    as={Link}
                    to={`/calendar/register/${event._id}`}
                    variant="danger"
                >
                    Unregister
                </Button>
            );
        } else if (event.registeredUsers.length >= event.maxCapacity) {
            // Disabled Register button
            return (
                <Button variant="success" disabled>
                    Already Full
                </Button>
            );
        } else {
            // Enabled Register button
            return (
                <Button
                    as={Link}
                    to={`/calendar/register/${event._id}`}
                    variant="success"
                >
                    Register
                </Button>
            );
        }
    }
}
