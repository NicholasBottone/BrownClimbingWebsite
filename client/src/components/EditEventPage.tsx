import React, { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import { EventType, IdParams, UserType } from "../types";
import { deleteEvent, fetchEvent, updateEvent } from "../utils/calendar";
import EventForm from "./EventForm";

export default function EditEventPage(props: {
    authenticated: boolean;
    user: UserType | undefined;
    loading: boolean;
}) {
    const { authenticated, user, loading } = props;
    const { eventId } = useParams<IdParams>();

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
                    <h1>Edit an Existing Event</h1>
                    <p>All fields are required.</p>
                    <br />
                    <br />
                    {loading || event == null ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <FormElement
                            authenticated={authenticated}
                            user={user}
                            event={event}
                        />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}

function FormElement(props: {
    authenticated: boolean;
    user: UserType | undefined;
    event: EventType;
}) {
    const { authenticated, user, event } = props;

    const [redirect, setRedirect] = useState(false);

    const [eventTitle, setEventTitle] = useState(event.eventTitle);
    const [description, setDescription] = useState(event.description);
    const [location, setLocation] = useState(event.location);
    const [eventDate, setEventDate] = useState(event.startTime.toISOString());
    const [startTime, setStartTime] = useState(event.startTime.toISOString());
    const [duration, setDuration] = useState(event.durationMinutes);
    const [transportInfo, setTransportInfo] = useState(event.transportInfo);
    const [maxCapacity, setMaxCapacity] = useState(event.maxCapacity);

    if (
        !authenticated ||
        redirect ||
        user?.googleId !== event.hostUser.googleId ||
        user?.moderator
    ) {
        // if user is not logged in or is not the host of the event
        return <Redirect to="/calendar" />;
    }

    const createJSONBody = () => {
        const durationAsNumber = Number(duration);
        const maxCapacityAsNumber = Number(maxCapacity);
        if (user) {
            return {
                hostUser: user,
                eventTitle,
                description,
                location,
                eventDate,
                startTime,
                duration: durationAsNumber,
                transportInfo,
                maxCapacity: maxCapacityAsNumber,
            };
        } else {
            console.error("User is not authenticated");
        }
    };

    const handleSubmit = async (form: React.SyntheticEvent) => {
        form.preventDefault();

        if (updateEvent(event, createJSONBody())) {
            alert(`Successfully edited "${eventTitle}" event!`); // TODO: Potentially consider a better success message/alert
            setRedirect(true);
        }
    };

    const handleDelete = () => {
        if (!event) return;

        if (window.confirm("Are you sure you want to delete this event?")) {
            if (deleteEvent(event)) {
                alert("Event deleted!");
            }
        }
    };

    return (
        <>
            <Button variant="danger" onClick={handleDelete}>
                Delete Event
            </Button>
            <br />
            <EventForm
                handleSubmit={handleSubmit}
                defaultValues={[
                    user?.displayName,
                    eventTitle,
                    description,
                    location,
                    eventDate,
                    startTime,
                    duration,
                    transportInfo,
                    maxCapacity,
                ]}
                setValues={[
                    () => null,
                    setEventTitle,
                    setDescription,
                    setLocation,
                    setEventDate,
                    setStartTime,
                    setDuration,
                    setTransportInfo,
                    setMaxCapacity,
                ]}
            />
        </>
    );
}
