import { EventType } from "../types";

export async function fetchCalendar(
    setEventList: (eventList: EventType[]) => void,
    setError: (error: string) => void
) {
    try {
        // sets up the promise
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
        if (res.status === 200) {
            // actually gets the data and converts it a json
            const resJson = await res.json();
            // set the event list to be displayed
            setEventList(resJson.events);
        } else {
            throw new Error("failed to authenticate user");
        }
    } catch (error) {
        console.error(error);
        setError("Failed to fetch the calendar from the database.");
    }
}
