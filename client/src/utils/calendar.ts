import { EventType, UserType } from "../types";

export async function fetchCalendar(
    setEventList: (eventList: EventType[]) => void,
    setError: (error: string) => void
) {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/calendar/events`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": "true",
                },
            }
        );
        if (res.ok) {
            // actually gets the data and converts it a json
            const resJson = await res.json();
            // set the event list to be displayed
            setEventList(resJson.events);
        } else {
            throw new Error("failed to fetch calendar");
        }
    } catch (error) {
        console.error(error);
        setError("Failed to fetch the calendar from the database.");
    }
}

export async function fetchEvent(
    eventId: string,
    setEvent: (event: EventType) => void,
    setError: (error: string) => void
) {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/calendar/events/${eventId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": "true",
                },
            }
        );
        if (res.ok) {
            // actually gets the data and converts it a json
            const resJson = await res.json();
            // set the event to be displayed
            setEvent(resJson.event);
            return true;
        } else {
            throw new Error("failed to fetch calendar");
        }
    } catch (error) {
        console.error(error);
        setError("Failed to fetch event data from the database.");
        return false;
    }
}

async function registrationPutRequest(
    path: string,
    event: EventType,
    user?: UserType
) {
    try {
        const res = await fetch(path, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user,
            }),
        });
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function registerForEvent(event: EventType, user?: UserType) {
    return registrationPutRequest(
        `${process.env.REACT_APP_API_BASE_URL}/calendar/events/${event._id}/register`,
        event,
        user
    );
}

export async function unregisterForEvent(event: EventType, user?: UserType) {
    return registrationPutRequest(
        `${process.env.REACT_APP_API_BASE_URL}/calendar/events/${event._id}/unregister`,
        event,
        user
    );
}

export async function createEvent(jsonBody: any) {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/calendar/events`,
            {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonBody),
            }
        );
        return res.ok;
    } catch (e) {
        console.error(e); // TODO: Better error reporting
        return false;
    }
}

export async function updateEvent(event: EventType, jsonBody: any) {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/calendar/event/${event._id}`,
            {
                method: "PUT",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonBody),
            }
        );
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}
