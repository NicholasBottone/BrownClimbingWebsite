import { EventType } from "../types";

export async function fetchCalendar(
    setEventList: (eventList: EventType[]) => void,
    setError: (error: string) => void
) {
    try {
        // *** TODO (fake data for display purposes only) *** \\
        setEventList([
            {
                eventId: "89j312j312",
                eventTitle: "Test Event",
                description: "Test Description",
                hostUser: {
                    googleId: "",
                    displayName: "John Smith",
                    displayPictureURL: "",
                },
                location: {
                    name: "Pro Rock Climbing Inc",
                    streetAddress: "",
                    city: "Providence",
                    state: "RI",
                },
                startTime: new Date("05/23/2021, 5:00 PM"),
                durationMinutes: 120,
                transportInfo: "John's Car",
                registeredUsers: [],
                maxCapacity: 5,
            },
            {
                eventId: "12k3kj21l",
                eventTitle: "Test Event 2",
                description: "Test Description",
                hostUser: {
                    googleId: "",
                    displayName: "Bob Joe",
                    displayPictureURL: "",
                },
                location: {
                    name: "Mount Everest",
                    streetAddress: "",
                    city: "Kala Patthar",
                    state: "Nepal",
                },
                startTime: new Date("05/29/2021, 3:00 PM"),
                durationMinutes: 180,
                transportInfo: "RIPTA Bus",
                registeredUsers: [
                    {
                        googleId: "",
                        displayName: "Bob Joe",
                        displayPictureURL: "",
                    },
                ],
                maxCapacity: 1,
            },
        ]);
    } catch (error) {
        console.error(error);
        setError("Failed to fetch the calendar from the database.");
    }
}
