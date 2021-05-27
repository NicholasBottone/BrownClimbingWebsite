import { EventType } from "../types";

export async function fetchCalendar(
    setEventList: (eventList: EventType[]) => void,
    setError: (error: string) => void
) {
    try {
        // *** TODO (fake data for display purposes only) *** \\
        setEventList([
            {
                eventTitle: "Test Event",
                hostUser: {googleId: "", displayName: "John Smith"},
                location: {name: "Pro Rock Climbing Inc", streetAddress: "", city: "Providence", state: "RI"},
                dateTime: new Date("05/23/2021, 5:00 PM"),
                transportType: "John's Car",
                registeredUsers: [],
                maxCapacity: 5
            }, {
                eventTitle: "Test Event 2",
                hostUser: {googleId: "", displayName: "Bob Joe"},
                location: {name: "Mount Everest", streetAddress: "", city: "Kala Patthar", state: "Nepal"},
                dateTime: new Date("05/29/2021, 3:00 PM"),
                transportType: "RIPTA Bus",
                registeredUsers: [{googleId: "", displayName: "Bob Joe"}],
                maxCapacity: 1
            }
        ]);
    } catch (error) {
        console.error(error);
        setError("Failed to fetch the calendar from the database.");
    }
}