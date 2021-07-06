import React from "react";
import { Redirect } from "react-router-dom";
import { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { UserType } from "../types";

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
                    <br />
                    <br />
                    {loading ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>Loading...</p>
                        </div> // don't show user info until loading from backend is done
                    ) : (
                        <FormElement
                            authenticated={authenticated}
                            user={user}
                        />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}

// TODO: Look into embedding Google Maps (https://www.embed-map.com/)

function FormElement(props: { authenticated: boolean; user: any }) {
    const { authenticated, user } = props;
    const [eventTitle, setEventTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState(""); // TODO: handle converting to date in the backend or figure out how to get as date on front end
    const [startTime, setStartTime] = useState(""); // TODO: same as for eventDate
    const [duration, setDuration] = useState("");
    const [transportInfo, setTransportInfo] = useState("");
    const [maxCapacity, setMaxCapacity] = useState("");

    // TODO: helper function to create the json body
    const createJSONBody = () => {
        const durationAsNumber = Number(duration);
        const maxCapacityAsNumber = Number(maxCapacity);
        const data = {
            hostUser: user._id,
            eventTitle,
            description,
            eventDate,
            startTime,
            durationAsNumber,
            transportInfo,
            maxCapacityAsNumber,
        };
        return data;
    };

    // TODO: handle form sanitization on front end
    // TODO: currently user type is any because I couldn't access user._id. Figure out how to properly export mongoose schemas
    // TODO: find better way to handle duration than in just minutes (kinda confusing to count it - not the most user friendly experience)
    // TODO: find a way to get location of the rock climbing gym and send that info to the backend

    const handleSubmit = async (form: React.SyntheticEvent) => {
        form.preventDefault();
        // using async await and js fetch api to make post request to backend
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/calendar/events`,
                {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(createJSONBody()),
                }
            );
            return response.json();
        } catch (e) {
            // TODO: better error handling :)
            console.log(e);
        }
    };

    return (
        <div className="p-3 text-left">
            {authenticated ? (
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
                                onChange={(e) => setMaxCapacity(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                How many attendees should be allowed to
                                register?
                            </Form.Text>
                        </Col>
                    </Form.Group>
                    {/* TODO: Location */}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            ) : (
                <Redirect to="/calendar" />
            )}
        </div>
    );
}
