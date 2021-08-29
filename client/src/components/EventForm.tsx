import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { locations } from "../types";

export default function EventForm(props: {
    handleSubmit: (event: any) => void;
    defaultValues: any[];
    setValues: ((value: any) => void)[];
}) {
    const { handleSubmit, defaultValues, setValues } = props;

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
                            defaultValue={defaultValues[0]}
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
                            defaultValue={defaultValues[1]}
                            onChange={(e) => setValues[1](e.target.value)}
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
                            defaultValue={defaultValues[2]}
                            onChange={(e) => setValues[2](e.target.value)}
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
                            defaultValue={defaultValues[3]}
                            onChange={(e) => setValues[3](e.target.value)}
                        >
                            {locations.map((loc) => (
                                <option key={loc}>{loc}</option> // TODO: Consider adding a default option for "Please select"
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
                            defaultValue={defaultValues[4].split("T")[0]}
                            onChange={(e) => setValues[4](e.target.value)}
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
                            value={defaultValues[5].substring(0, 5)}
                            onChange={(e) => setValues[5](e.target.value)}
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
                            max={1000}
                            defaultValue={defaultValues[6]}
                            onChange={(e) => setValues[6](e.target.value)}
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
                            defaultValue={defaultValues[7]}
                            onChange={(e) => setValues[7](e.target.value)}
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
                            max={100}
                            defaultValue={defaultValues[8]}
                            onChange={(e) => setValues[8](e.target.value)}
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
