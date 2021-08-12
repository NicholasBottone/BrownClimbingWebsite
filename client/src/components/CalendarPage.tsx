import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";

import { BasicUserType, EventType, UserType } from "../types";
import {
    fetchCalendar,
    registerForEvent,
    unregisterForEvent,
} from "../utils/calendar";
import { handleLoginClick } from "../utils/auth";

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
                        <CalendarElement />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );

    // TODO: Look into Full Calendar (https://fullcalendar.io/) and Big Calendar (https://jquense.github.io/react-big-calendar/)
    // TODO: Look into embedding Google Maps (https://www.embed-map.com/)

    function CalendarElement() {
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
                        <Spinner animation="border" role="status" />
                    </div>
                )}

                <br />
                <br />
                {authenticated ? (
                    <Button as={Link} to="/calendar/create" variant="primary">
                        Create/Host an Event
                    </Button>
                ) : (
                    <Button onClick={handleLoginClick} variant="primary">
                        Login to RSVP for Events
                    </Button>
                )}
            </>
        );
    }
}

function EventElement(props: { event: EventType; user: UserType | undefined }) {
    const { event, user } = props;

    // TODO: Consider adding a visual flair to indicate which events you are registered for / own
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
                <ButtonGroup>
                    <Button>View Details</Button>
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

        function RegisterButton() {
            const isRegistered = event.registeredUsers.some(
                (registrant: BasicUserType) =>
                    registrant.googleId === user?.googleId
            );

            const register = () => {
                if (registerForEvent(event, user)) {
                    event.registeredUsers.push(user as BasicUserType);
                    alert(`You are now registered for ${event.eventTitle}!`);
                }
            };
            const unregister = () => {
                if (unregisterForEvent(event, user)) {
                    event.registeredUsers.splice(
                        event.registeredUsers.indexOf(user as BasicUserType),
                        1
                    );
                    alert(
                        `You are no longer registered for ${event.eventTitle}.`
                    );
                }
            };

            return isRegistered ? (
                <Button variant="danger" onClick={register}>
                    Unregister
                </Button>
            ) : (
                <Button
                    variant="success"
                    onClick={unregister}
                    disabled={event.registeredUsers.length >= event.maxCapacity}
                >
                    Register
                </Button>
            );
        }
    }
}
