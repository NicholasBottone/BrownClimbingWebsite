import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";

import { EventType, UserType } from "../types";
import { fetchCalendar } from "../utils/calendar";

export default function CalendarPage(props: {
    authenticated: boolean;
    user: UserType | undefined;
    loading: boolean;
}) {
    const { authenticated, user, loading } = props;
    const [eventList, setEventList] = useState<EventType[]>();
    const [error, setError] = useState("Loading calendar data...");

    // called once when components on page have rendered
    useEffect(() => {
        // FIXME: look into why this is called multiple times per page load
        fetchCalendar(setEventList, setError);
    }, []);

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>Events Calendar for Brown Climbing</h1>
                    <br />
                    <br />
                    {loading ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>Loading...</p>
                        </div> // don't show user info until loading from backend is done
                    ) : (
                        <CalendarElement
                            authenticated={authenticated}
                            user={user}
                            eventList={eventList}
                            error={error}
                        />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}

// TODO: Look into Full Calendar (https://fullcalendar.io/) and Big Calendar (https://jquense.github.io/react-big-calendar/)
// TODO: Look into embedding Google Maps (https://www.embed-map.com/)

function CalendarElement(props: {
    authenticated: boolean;
    user: UserType | undefined;
    eventList: EventType[] | undefined;
    error: string;
}) {
    const { authenticated, user, eventList, error } = props;

    return (
        <>
            {eventList != null ? (
                <CardColumns style={{ columnCount: 1 }}>
                    {eventList.map((event: EventType) => (
                        <EventElement
                            key={event._id}
                            event={event}
                            user={user}
                        />
                    ))}
                </CardColumns>
            ) : (
                <div>
                    <p>{error}</p>
                    <Spinner animation="border" role="danger" />
                </div>
            )}

            <br />
            <br />
            {authenticated ? (
                <Button as={Link} to="/calendar/create" variant="primary">
                    Create/Host an Event
                </Button>
            ) : (
                <Button variant="primary">Login to RSVP for Events</Button>
            )}
        </>
    );
}

function EventElement(props: { event: EventType; user: UserType | undefined }) {
    const { event, user } = props;

    return (
        <Card>
            <Card.Body>
                <Card.Title>{event.eventTitle}</Card.Title>
                <Card.Subtitle>
                    Hosted by {event.hostUser.displayName}
                </Card.Subtitle>
                <Card.Text>
                    {event.location}
                    <br />
                    {event.startTime.toLocaleString()}
                    <br />
                    {event.transportInfo}
                    <br />
                    Registered: {event.registeredUsers.length}/
                    {event.maxCapacity}
                </Card.Text>
                <ButtonGroup>
                    <Button>View Details</Button>
                    {user != null ? (
                        <RegisteredUserEventOptions event={event} user={user} />
                    ) : (
                        <></>
                    )}
                </ButtonGroup>
            </Card.Body>
        </Card>
    );
}

function RegisteredUserEventOptions(props: {
    event: EventType;
    user: UserType | undefined;
}) {
    const { event, user } = props;

    return (
        <>
            <Button>View Registrants</Button>
            {event.hostUser.googleId === user?.googleId ? (
                <Button>Edit Event</Button>
            ) : (
                <Button
                    disabled={event.registeredUsers.length >= event.maxCapacity}
                >
                    Registration
                </Button>
            )}
        </>
    );
}
