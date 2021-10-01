import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import { locations, UserType } from "../types";
import { createEvent } from "../utils/calendar";
import EventForm from "../components/EventForm";

export default function CreateEventPage(props: {
    user: UserType | undefined;
    loading: boolean;
}) {
    const { user, loading } = props;

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

        if (!user || redirect) {
            return <Redirect to="/calendar" />;
        }

        const createJSONBody = () => {
            const durationAsNumber = Number(duration);
            const maxCapacityAsNumber = Number(maxCapacity);
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
        };

        // TODO: handle form sanitization on front end
        // TODO: find better way to handle duration than in just minutes (kinda confusing to count it - not the most user friendly experience)
        // TODO: find a way to get location of the rock climbing gym and send that info to the backend

        const handleSubmit = async (form: React.SyntheticEvent) => {
            form.preventDefault();

            if (await createEvent(createJSONBody())) {
                alert(`Successfully created "${eventTitle}" event!`); // TODO: Potentially consider a better success message/alert
                setRedirect(true);
            }
        };

        return (
            <EventForm
                handleSubmit={handleSubmit}
                defaultValues={[
                    user.displayName,
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
        );
    }
}
