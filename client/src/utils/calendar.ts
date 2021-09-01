import { EventType, UserType } from "../types";

export async function fetchCalendar() {
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
            // gets the data and converts it a json
            const resJson = await res.json();
            // return the event list to be displayed
            return resJson.events;
        } else {
            console.error(res);
            return `Error fetching the event: ${res.status} - ${res.statusText}
            - ${await res.text()}`;
        }
    } catch (error) {
        console.error(error);
        return "Failed to fetch the calendar from the database.";
    }
}

export async function fetchEvent(eventId: string) {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/calendar/event/${eventId}`,
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
            // gets the data and converts it a json
            const resJson = await res.json();
            // return the event to be displayed
            return resJson.event;
        } else {
            console.error(res);
            return `Error fetching the event: ${res.status} - ${res.statusText}
            - ${await res.text()}`;
        }
    } catch (error) {
        console.error(error);
        return "Failed to fetch event data from the database.";
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
        });
        if (!res.ok) {
            console.error(res.statusText);
            alert(`Error registering: ${res.status} - ${res.statusText}
            - ${await res.text()}`);
        }
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function registerForEvent(event: EventType, user?: UserType) {
    return registrationPutRequest(
        `${process.env.REACT_APP_API_BASE_URL}/calendar/event/${event._id}/register`,
        event,
        user
    );
}

export async function unregisterForEvent(event: EventType, user?: UserType) {
    return registrationPutRequest(
        `${process.env.REACT_APP_API_BASE_URL}/calendar/event/${event._id}/unregister`,
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
        if (!res.ok) {
            console.error(res.statusText);
            alert(`Error creating event: ${res.status} - ${res.statusText}
            - ${await res.text()}`);
        }
        return res.ok;
    } catch (e) {
        console.error(e);
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
        if (!res.ok) {
            console.error(res.statusText);
            alert(`Error updating event: ${res.status} - ${res.statusText}
            - ${await res.text()}`);
        }
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function deleteEvent(event: EventType) {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/calendar/event/${event._id}`,
            {
                method: "DELETE",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!res.ok) {
            console.error(res.statusText);
            alert(`Error deleting event: ${res.status} - ${res.statusText}
            - ${await res.text()}`);
        }
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}
