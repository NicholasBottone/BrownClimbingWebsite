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
                description: "Test Description",
                hostUser: {googleId: "", displayName: "John Smith"},
                location: {name: "Pro Rock Climbing Inc", streetAddress: "", city: "Providence", state: "RI"},
                startTime: new Date("05/23/2021, 5:00 PM"),
                durationMinutes: 120,
                transportType: "John's Car",
                registeredUsers: [],
                maxCapacity: 5
            }, {
                eventTitle: "Test Event 2",
                description: "Test Description",
                hostUser: {googleId: "", displayName: "Bob Joe"},
                location: {name: "Mount Everest", streetAddress: "", city: "Kala Patthar", state: "Nepal"},
                startTime: new Date("05/29/2021, 3:00 PM"),
                durationMinutes: 180,
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