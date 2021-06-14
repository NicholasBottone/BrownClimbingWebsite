import React from "react";
import { Redirect } from "react-router-dom";

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

// TODO: Look into embeding Google Maps (https://www.embed-map.com/)

function FormElement(props: {
    authenticated: boolean;
    user: UserType | undefined;
}) {
    const { authenticated, user } = props;

    return (
        <div className="p-3 text-left">
            {authenticated ? (
                <Form
                    action={`${process.env.REACT_APP_API_BASE_URL}/calendar/events`}
                    method="POST"
                >
                    <Form.Group as={Row} controlId="hostUser">
                        <Form.Label column sm={3}>
                            Host
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control
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
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formDate">
                        <Form.Label column sm={3}>
                            Date
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="date" required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="startTime">
                        <Form.Label column sm={3}>
                            Start Time
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="time" required />
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
