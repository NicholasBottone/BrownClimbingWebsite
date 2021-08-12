import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { locations, UserType } from "../types";
import { createEvent } from "../utils/calendar";

export default function CreateEventPage(props: {
    authenticated: boolean;
    user: UserType | undefined;
    loading: boolean;
}) {
    const { authenticated, user, loading } = props;

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>Create an Event for Brown Climbing</h1>
                    <p>All fields are required.</p>
                    <br />
                    <br />
                    {loading ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <FormElement />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );

    function FormElement() {
        const [redirect, setRedirect] = useState(false);

        const [eventTitle, setEventTitle] = useState("");
        const [description, setDescription] = useState("");
        const [location, setLocation] = useState(locations[0]);
        const [eventDate, setEventDate] = useState("");
        const [startTime, setStartTime] = useState("");
        const [duration, setDuration] = useState("");
        const [transportInfo, setTransportInfo] = useState("");
        const [maxCapacity, setMaxCapacity] = useState("");

        if (!authenticated || redirect) {
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

        // TODO: handle form sanitization on front end
        // TODO: find better way to handle duration than in just minutes (kinda confusing to count it - not the most user friendly experience)
        // TODO: find a way to get location of the rock climbing gym and send that info to the backend

        const handleSubmit = async (form: React.SyntheticEvent) => {
            form.preventDefault();

            if (createEvent(createJSONBody())) {
                alert(`Successfully created "${eventTitle}" event!`); // TODO: Potentially consider a better success message/alert
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
                                min={1}
                                onChange={(e) => setDuration(e.target.value)}
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
                                onChange={(e) =>
                                    setTransportInfo(e.target.value)
                                }
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
                                min={1}
                                onChange={(e) => setMaxCapacity(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                How many attendees should be allowed to
                                register?
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
}
