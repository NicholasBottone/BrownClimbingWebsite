import { Router, Request, Response } from "express";
import { authCheck } from "../middleware/auth";
import { body } from "express-validator";
import Event from "../models/Event";
import { sendConfirmationEmail, sendCreationEmail } from "../config/mailer";
import { getICS } from "../config/ics";
import { IUser } from "../models/User";

const eventRouter = Router();

// GET request that retrieves events, populates with User Schema, and sorts start time of event
eventRouter.get("/events", async (_req, res) => {
    // TODO: Consider adding pagination
    const events = await Event.find({ startTime: { $gt: new Date() } })
        .populate("hostUser")
        .populate("registeredUsers")
        .sort({ startTime: 1 });

    res.json({ events });
});

// GET request that retrieves a specific event
eventRouter.get("/event/:eventId", async (req, res) => {
    const event = await Event.findById(req.params.eventId)
        .populate("hostUser")
        .populate("registeredUsers");

    if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
    }

    res.json({ event });
});

// GET request that retrieves the ICS file for an event
eventRouter.get("/event/:eventId/ics", async (req, res) => {
    const event = await Event.findById(req.params.eventId).populate("hostUser");
    if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
    }

    getICS(event, (error, ics) => {
        if (error) {
            console.error(error);
            res.status(500).send(error.message);
            return;
        }
        // Return the ICS file with the correct headers
        res.set("Content-Type", "text/calendar");
        res.set(
            "Content-Disposition",
            `attachment; filename="${event.eventTitle}.ics"`
        );
        res.send(ics);
    });
});

// POST request that creates new event
eventRouter.post(
    "/events",
    authCheck,
    body("eventTitle").trim(),
    body("description").trim(),
    body("location").trim(),
    body("startTime").trim(),
    body("duration").trim().isInt({ min: 1, max: 1000 }),
    body("transportInfo").trim(),
    body("maxCapacity").trim().isInt({ min: 1, max: 100 }),
    async (req, res) => {
        const user = req.user as IUser;

        // Combine startTime and eventDate to create a new Date object
        const startTime = new Date(
            req.body.eventDate + " " + req.body.startTime
        );

        // validate startTime to be in future
        if (startTime < new Date()) {
            res.status(400).send("Start time must be in the future.");
            return;
        }

        // Create new Event object
        const event = new Event({
            eventTitle: req.body.eventTitle,
            description: req.body.description,
            hostUser: req.user, // host user is the logged in user
            location: req.body.location,
            startTime: startTime,
            durationMinutes: parseInt(req.body.duration),
            transportInfo: req.body.transportInfo,
            maxCapacity: parseInt(req.body.maxCapacity),
            registeredUsers: [req.user], // include the host user in registeredUsers
        });

        // Save the new event
        await event.save();

        res.status(200).json({
            event,
            message: "Event created successfully",
        });

        // Send confirmation email to host user
        sendCreationEmail(`"${user.displayName}" ${user.email}`, event);
        // TODO: Schedule reminder email to be sent
    }
);

// PUT request for user registering for event
eventRouter.put(
    "/event/:eventId/register", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        const user = req.user as IUser;

        const event = await Event.findById(req.params.eventId);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        // check if the user is already registered for the event

        if (
            event.registeredUsers.some(
                (u) => u.toString() === user._id.toString()
            )
        ) {
            res.status(400).send("User is already registered for this event.");
            return;
        }

        // check if the event is full
        if (event.maxCapacity <= event.registeredUsers.length) {
            res.status(400).send("Event is full.");
            return;
        }

        // update the registeredUsers field of the current event in the db
        event.registeredUsers.push(user);
        await event.save();
        res.status(200).send("User registered successfully");

        // send confirmation email to user
        sendConfirmationEmail(`"${user.displayName}" ${user.email}`, event);
        // TODO: Schedule reminder email to be sent
    }
);

// PUT request for user unregistering from event
eventRouter.put(
    "/event/:eventId/unregister", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        const user = req.user as IUser;

        const event = await Event.findById({ _id: req.params.eventId });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        // check if the user is already registered for the event
        if (
            !event.registeredUsers.some(
                (u) => u.toString() === user._id.toString()
            )
        ) {
            res.status(400).send("User is not registered for this event.");
            return;
        }

        // update the registeredUsers field of the current event in the db
        event.registeredUsers = event.registeredUsers.filter(
            (u) => u.toString() !== user._id.toString()
        );
        await event.save();
        res.status(200).send("User unregistered successfully");
    }
);

// DELETE request for deleting an existing event
eventRouter.delete(
    "/event/:eventId", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        const user = req.user as IUser;

        const event = await Event.findById({ _id: req.params.eventId });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        // check if the user is the host of the event or a moderator
        if (
            event.hostUser.toString() !== user._id.toString() &&
            !user.moderator
        ) {
            res.status(403).send("Unauthorized - Not the host of this event");
            return;
        }

        // delete the event from the db
        await event.remove();
        res.status(200).send("Successfully deleted event");
    }
);

// PUT request for editing an event
eventRouter.put(
    "/event/:eventId", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    body("eventTitle").trim(),
    body("description").trim(),
    body("location").trim(),
    body("startTime").trim(),
    body("duration").trim().isInt({ min: 1, max: 1000 }),
    body("transportInfo").trim(),
    body("maxCapacity").trim().isInt({ min: 1, max: 100 }),
    async (req: Request, res: Response) => {
        const user = req.user as IUser;

        const event = await Event.findById({ _id: req.params.eventId });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        // check if the user is the host of the event or a moderator
        if (
            event.hostUser._id.toString() !== user._id.toString() &&
            !user.moderator
        ) {
            res.status(403).send("Unauthorized - Not the host of this event");
            return;
        }

        // Combine startTime and eventDate to create a new Date object
        const startTime = new Date(
            req.body.eventDate + " " + req.body.startTime
        );

        // validate startTime to be in future
        if (startTime < new Date()) {
            res.status(400).send("Start time must be in the future.");
            return;
        }

        // update the event in the db
        event.eventTitle = req.body.eventTitle;
        event.description = req.body.description;
        event.location = req.body.location;
        event.startTime = startTime;
        event.durationMinutes = parseInt(req.body.duration);
        event.transportInfo = req.body.transportInfo;
        event.maxCapacity = parseInt(req.body.maxCapacity);

        await event.save();
        res.status(200).send("Event updated successfully");
    }
);

export default eventRouter;
