import React, { useEffect, useState } from "react";

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";

import { EventType, UserType } from "../types";
import { fetchCalendar } from "../utils/calendar";

export default function HomePage(props: {authenticated: boolean, user: UserType | undefined}) {
    const { authenticated, user } = props;
    const [eventList, setEventList] = useState<EventType[]>();
    const [error, setError] = useState("Loading calendar data...");

    // called once when components on page have rendered
    useEffect(() => {
        fetchCalendar(setEventList, setError);
    }, []);

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>Events Calendar for Brown Climbing</h1>
                    <br/><br/>
                    {eventList != null ? (
                        <CardColumns style={{ columnCount: 1 }}>
                            {
                                eventList.map((event: EventType) => 
                                    <EventElement event={event} user={user}/>)
                            }
                        </CardColumns>
                    ) : (
                        <div>
                            <p>{error}</p>
                            <Spinner animation="border" role="status"/>
                        </div>
                    )}
                    
                    <br/><br/>
                    {authenticated ? (
                        <Button variant="primary">Create/Host an Event</Button>
                    ) : (
                        <Button variant="primary">Login to RSVP for Events</Button>
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}

function EventElement(props: {event: EventType, user: UserType | undefined}) {
    const { event, user } = props

    return (
        <Card>
            <Card.Body>
                <Card.Title>{event.eventTitle}</Card.Title>
                <Card.Subtitle>Hosted by {event.hostUser.displayName}</Card.Subtitle>
                <Card.Text>
                    {event.location.name} ({event.location.city}, {event.location.state})<br/>
                    {event.startTime.toLocaleString()}<br/>
                    {event.transportType}<br/>
                    Registered: {event.registeredUsers.length}/{event.maxCapacity}
                </Card.Text>
                <ButtonGroup>
                    <Button>View Details</Button>
                    {user != null ? (
                        <>
                            <Button>View Registrants</Button>
                            {event.hostUser.googleId === user?.googleId ? (
                                <Button>Edit Event</Button>
                            ) : (
                                <Button disabled={event.registeredUsers.length >= event.maxCapacity}>Registration</Button>
                            )}
                        </>
                    ) : (<></>)}
                </ButtonGroup>
            </Card.Body>
        </Card>
    );
}
