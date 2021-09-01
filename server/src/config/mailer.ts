import nodemailer, { SentMessageInfo } from "nodemailer";
import { EventType } from "src/types";

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

export function sendConfirmationEmail(
    to: string,
    event: EventType
): Promise<SentMessageInfo> {
    const eventURL = `${process.env.CLIENT_URL}/calendar/event/${event._id}`;
    return sendEmail(
        to,
        `${event.eventTitle} - Confirmation`,
        `Hey!
        
        You have successfully registered for ${event.eventTitle}.
        
        ${event.startTime.toLocaleString()}
        
        For more information, or to cancel, visit ${eventURL}
        See you there!
        
        --
        Brown Climbing Automated Message`
    );
}

export function sendCreationEmail(
    to: string,
    event: EventType
): Promise<SentMessageInfo> {
    const eventURL = `${process.env.CLIENT_URL}/calendar/event/${event._id}`;
    return sendEmail(
        to,
        `${event.eventTitle} - Confirmation`,
        `Hey!
        
        You have created a new event: ${event.eventTitle}.

        ${event.startTime.toLocaleString()}

        You can edit and update information about your event at ${eventURL}
        Registrants will receive an email confirmation when they register and a reminder email 24 hours prior to the event.
        You can see who has registered on the event details page.
        Note that you are responsible for keeping the event information up to date and communicating with the registrants.
        You can edit or delete/cancel your event at any time from the details page above.
        
        Good luck hosting your event!
        
        --
        Brown Climbing Automated Message`
    );
}

export function sendReminderEmail(
    to: string,
    event: EventType
): Promise<SentMessageInfo> {
    const eventURL = `${process.env.CLIENT_URL}/calendar/event/${event._id}`;
    return sendEmail(
        to,
        `${event.eventTitle} - Reminder`,
        `Hey!
        
        This is a reminder that ${event.eventTitle} is coming up soon!
        
        ${event.startTime.toLocaleString()}
        
        For more information, or to cancel, visit ${eventURL}
        See you there!
        
        --
        Brown Climbing Automated Message`
    );
}
