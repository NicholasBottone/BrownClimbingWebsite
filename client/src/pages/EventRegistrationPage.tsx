import React, { useEffect, useState } from "react";
import { Link, Redirect, useParams } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import { BasicUserType, EventType, IdParams, UserType } from "../types";
import {
    fetchEvent,
    registerForEvent,
    unregisterForEvent,
} from "../utils/calendar";
import { handleLoginClick } from "../utils/auth";

export default function EventRegistrationPage(props: {
    user: UserType | undefined;
    loading: boolean;
}) {
    const { user, loading } = props;
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
                    <h1>{event?.eventTitle || "Brown Climbing Event"}</h1>
                    <h3>Event Registration</h3>
                    <br />
                    <br />
                    {loading || event == null ? (
                        <div>
                            <Spinner animation="border" role="status" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <RegistrationConfirmation event={event} user={user} />
                    )}
                </Jumbotron>
            </Container>
        </div>
    );
}
function RegistrationConfirmation(props: {
    event: EventType;
    user: UserType | undefined;
}) {
    const { event, user } = props;
    const [redirect, setRedirect] = useState(false);

    if (redirect) {
        return <Redirect to={`/calendar/event/${event._id}`} />;
    }

    return (
        <>
            {user ? (
                <>
                    <p>
                        Are you sure you would like to change your registration
                        status for this event?
                    </p>
                    <RegisterButton />
                </>
            ) : (
                <Button onClick={handleLoginClick} variant="primary">
                    Login to Register
                </Button>
            )}

            <Button
                variant="secondary"
                as={Link}
                to={`/calendar/event/${event._id}`}
            >
                Cancel
            </Button>
        </>
    );

    function RegisterButton() {
        const isRegistered = event.registeredUsers.some(
            (registrant: BasicUserType) =>
                registrant.googleId === user?.googleId
        );

        const register = async () => {
            if (await registerForEvent(event, user)) {
                setRedirect(true);
                alert(`You are now registered for ${event.eventTitle}!`);
            }
        };
        const unregister = async () => {
            if (await unregisterForEvent(event, user)) {
                setRedirect(true);
                alert(`You are no longer registered for ${event.eventTitle}.`);
            }
        };

        return isRegistered ? (
            <Button variant="danger" onClick={unregister}>
                Unregister
            </Button>
        ) : (
            <Button
                variant="success"
                onClick={register}
                disabled={event.registeredUsers.length >= event.maxCapacity}
            >
                Register
            </Button>
        );
    }
}
