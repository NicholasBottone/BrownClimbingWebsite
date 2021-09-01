import { createEvent } from "ics";
import { EventType } from "../types";

export function getICS(
    event: EventType,
    callback: (err: Error | undefined, ics: string) => void
) {
    const date = new Date(event.startTime);
    const url = `${process.env.CLIENT_URL}/calendar/event/${event._id}`;

    const icsEvent: any = {
        start: [
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
        ],
        duration: { minutes: event.durationMinutes },
        title: event.eventTitle,
        description: `${event.description}\nBrown Climbing Event\n${url}`,
        location: event.location,
        url: url,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        alarms: [
            {
                action: "display",
                description: "Reminder",
                trigger: { minutes: 30, before: true },
            },
            {
                action: "display",
                description: "Reminder",
                trigger: { hours: 24, before: true },
            },
        ],
    };

    createEvent(icsEvent, callback);
}
