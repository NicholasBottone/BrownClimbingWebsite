import nodemailer, { SentMessageInfo } from "nodemailer";
import { EventType } from "src/types";
import { getICS } from "./ics";

// TODO: Separate the email messages into their own files

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOSTNAME,
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

function sendEmail(
    to: string,
    subject: string,
    text: string
): Promise<SentMessageInfo> {
    return transporter.sendMail({
        from: `"Brown Climbing" ${process.env.SMTP_USERNAME}`,
        to,
        subject,
        text,
    });
}

function sendEmailWithICAL(
    to: string,
    subject: string,
    text: string,
    ics: string
): Promise<SentMessageInfo> {
    return transporter.sendMail({
        from: `"Brown Climbing" ${process.env.SMTP_USERNAME}`,
        to,
        subject,
        text,
        icalEvent: {
            content: ics,
        },
    });
}

export function sendConfirmationEmail(to: string, event: EventType) {
    const eventURL = `${process.env.CLIENT_URL}/calendar/event/${event._id}`;
    getICS(event, (err, ics) => {
        if (err) {
            console.error(err);
            sendEmail(
                to,
                `${event.eventTitle} - Confirmation`,
                `Hey!
                \nYou have successfully registered for ${event.eventTitle}.
                \n${event.startTime.toLocaleString()}
                \nFor more information, or to cancel, visit ${eventURL}\nSee you there!
                \n--\nBrown Climbing Automated Message`
            );
        } else {
            sendEmailWithICAL(
                to,
                `${event.eventTitle} - Confirmation`,
                `Hey!
                \nYou have successfully registered for ${event.eventTitle}.
                \n${event.startTime.toLocaleString()}
                \nFor more information, or to cancel, visit ${eventURL}
                \nA calendar file is attached for your convenience.\nSee you there!
                \n--\nBrown Climbing Automated Message`,
                ics
            );
        }
    });
}

export function sendCreationEmail(to: string, event: EventType) {
    const eventURL = `${process.env.CLIENT_URL}/calendar/event/${event._id}`;
    getICS(event, (err, ics) => {
        if (err) {
            console.error(err);
            sendEmail(
                to,
                `${event.eventTitle} - Confirmation`,
                `Hey!
                \nYou have created a new event: ${event.eventTitle}.
                \n${event.startTime.toLocaleString()}
                \nYou can edit and update information about your event at ${eventURL}
                \nRegistrants will receive an email confirmation when they register and a reminder email 24 hours prior to the event.
                \nYou can see who has registered on the event details page.
                \nNote that you are responsible for keeping the event information up to date and communicating with the registrants.
                \nYou can edit or delete/cancel your event at any time from the details page above.
                \nGood luck hosting your event!
                \n--\nBrown Climbing Automated Message`
            );
        } else {
            sendEmailWithICAL(
                to,
                `${event.eventTitle} - Confirmation`,
                `Hey!
                \nYou have created a new event: ${event.eventTitle}.
                \n${event.startTime.toLocaleString()}
                \nYou can edit and update information about your event at ${eventURL}
                \nA calendar file is attached for your convenience.
                \nRegistrants will receive an email confirmation when they register and a reminder email 24 hours prior to the event.
                \nYou can see who has registered on the event details page.
                \nNote that you are responsible for keeping the event information up to date and communicating with the registrants.
                \nYou can edit or delete/cancel your event at any time from the details page above.
                \nGood luck hosting your event!
                \n--\nBrown Climbing Automated Message`,
                ics
            );
        }
    });
}

export function sendReminderEmail(to: string, event: EventType) {
    const eventURL = `${process.env.CLIENT_URL}/calendar/event/${event._id}`;
    sendEmail(
        to,
        `${event.eventTitle} - Reminder`,
        `Hey!
        \nThis is a reminder that ${event.eventTitle} is coming up soon!
        \n${event.startTime.toLocaleString()}
        \nFor more information, or to cancel, visit ${eventURL}\nSee you there!
        \n--\nBrown Climbing Automated Message`
    );
}
