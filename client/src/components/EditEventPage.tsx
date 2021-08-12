import React, { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { EventType, locations, UserType } from "../types";
import { deleteEvent, fetchEvent, updateEvent } from "../utils/calendar";

export default function EditEventPage(props: {
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
    }, [eventId]);

    const handleDelete = () => {
        if (!event) return;

        if (window.confirm("Are you sure you want to delete this event?")) {
            if (deleteEvent(event)) {
                alert("Event deleted!");
            }
        }
    };

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
                        </div> // don't show user info until loading from backend is done
                    ) : (
                        <>
                            <FormElement
                                authenticated={authenticated}
                                user={user}
                                event={event}
                            />
                            <Button variant="danger" onClick={handleDelete}>
                                Delete Event
                            </Button>
                        </>
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
                durationAsNumber,
                transportInfo,
                maxCapacityAsNumber,
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

    return (
        <div className="p-3 text-left">
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="hostUser">
                    <Form.Label column sm={3}>
                        Host
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            name="hostUser"
                            type="text"
                            defaultValue={user?.displayName}
                            readOnly
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="eventTitle">
                    <Form.Label column sm={3}>
                        Event Title
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            placeholder="Event Title"
                            required
                            onChange={(e) => setEventTitle(e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="description">
                    <Form.Label column sm={3}>
                        Description
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            placeholder="Description"
                            required
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="location">
                    <Form.Label column sm={3}>
                        Location
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            as="select"
                            required
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            {locations.map((loc) => (
                                <option>{loc}</option> // TODO: Consider adding a default option for "Please select"
                            ))}
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formDate">
                    <Form.Label column sm={3}>
                        Date
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="date"
                            required
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setEventDate(e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="startTime">
                    <Form.Label column sm={3}>
                        Start Time
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="time"
                            required
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="durationMinutes">
                    <Form.Label column sm={3}>
                        Duration
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="number"
                            placeholder="Duration"
                            required
                            onChange={(e) => setDuration(+e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Estimated event duration in minutes
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="transportInfo">
                    <Form.Label column sm={3}>
                        Transport Info
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            placeholder="Transport Info"
                            required
                            onChange={(e) => setTransportInfo(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            How will the attendees be getting to the event?
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="maxCapacity">
                    <Form.Label column sm={3}>
                        Max Capacity
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="number"
                            placeholder="Max Capacity"
                            required
                            onChange={(e) => setMaxCapacity(+e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            How many attendees should be allowed to register?
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
