import { Router, Request, Response } from "express";
import { Error } from "mongoose";
import { authCheck } from "../middleware/auth";
import { body } from "express-validator";
import Event from "../models/Event";
import { EventType } from "../types";
import { sendConfirmationEmail, sendCreationEmail } from "../config/mailer";
import { getICS } from "../config/ics";

// FIXME: This is a hacky way to get info from the express user object.
//         We should probably use TypeScript namespaces instead.
export function u(user: any) {
    return user;
}

const eventRouter = Router();

// GET request that retrieves events, populates with User Schema, and sorts start time of event
eventRouter.get("/events", (_req: Request, res: Response) => {
    // TODO: Consider adding pagination
    Event.find({ startTime: { $gt: new Date() } }, (err: Error, events: EventType[]) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }
        res.json({ events });
    })
        .populate("hostUser")
        .populate("registeredUsers")
        .sort([["startTime", 1]]);
});

// GET request that retrieves a specific event
eventRouter.get("/event/:eventId", (req: Request, res: Response) => {
    Event.findById(req.params.eventId, (err: Error, event: EventType) => {
        if (err) {
            err.name === "CastError"
                ? res.status(404).send("Event not found")
                : res.status(500).send(err.message);
            return;
        }
        res.json({ event });
    })
        .populate("hostUser")
        .populate("registeredUsers");
});

// GET request that retrieves the ICS file for an event
eventRouter.get("/event/:eventId/ics", (req: Request, res: Response) => {
    Event.findById(req.params.eventId, (err: Error, event: EventType) => {
        if (err) {
            err.name === "CastError"
                ? res.status(404).send("Event not found")
                : res.status(500).send(err.message);
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
    }).populate("hostUser");
});

// POST request that creates new event
eventRouter.post(
    "/events",
    authCheck,
    body("eventTitle").trim().escape(),
    body("description").trim().escape(),
    body("location").trim().escape(),
    body("startTime").trim().escape(),
    body("duration").trim().escape().isInt({ min: 1, max: 1000 }),
    body("transportInfo").trim().escape(),
    body("maxCapacity").trim().escape().isInt({ min: 1, max: 100 }),
    (req: Request, res: Response) => {
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
        event.save((err: Error) => {
            if (err) {
                err.name === "ValidationError"
                    ? res.status(400).send(err.message)
                    : res.status(500).send(err.message);
                return;
            }
            res.status(200).json({
                event,
                message: "Event created successfully",
            });

            // Send confirmation email to host user
            sendCreationEmail(
                `"${u(req.user).displayName}" ${u(req.user).email}`,
                event
            );
            // TODO: Schedule reminder email to be sent
        });
    }
);

// PUT request for user registering for event
eventRouter.put(
    "/event/:eventId/register", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        // check if the user is already registered for the event
        const queryRegisteredUsers = await Event.findById(
            { _id: req.params.eventId },
            "registeredUsers"
        );
        if (queryRegisteredUsers.registeredUsers.includes(u(req.user)._id)) {
            res.status(400).send("User is already registered for this event.");
            return;
        }

        // check if the event is full
        const queryMaxCapacity = await Event.findById(
            { _id: req.params.eventId },
            "maxCapacity"
        );
        if (
            queryMaxCapacity.maxCapacity <=
            queryRegisteredUsers.registeredUsers.length
        ) {
            res.status(400).send("Event is full.");
            return;
        }
        // TODO: clean up the if else statements (could probably be more concise and figure out how to handle any errors)

        // update the registeredUsers field of the current event in the db
        Event.findByIdAndUpdate(
            { _id: req.params.eventId }, // getting event by id
            { $push: { registeredUsers: u(req.user) } }, // pushing the user into registeredUsers array
            (err, event: EventType) => {
                if (err) {
                    err.name === "CastError"
                        ? res.status(404).send("Event not found")
                        : res.status(500).send(err.message);
                    return;
                }
                res.status(200).send("User registered successfully");

                // send confirmation email to user
                sendConfirmationEmail(
                    `"${u(req.user).displayName}" ${u(req.user).email}`,
                    event
                );
                // TODO: Schedule reminder email to be sent
            }
        );
    }
);

// PUT request for user unregistering from event
eventRouter.put(
    "/event/:eventId/unregister", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        // check if the user is already registered for the event
        const queryRegisteredUsers = await Event.findById(
            { _id: req.params.eventId },
            "registeredUsers"
        );
        if (!queryRegisteredUsers.registeredUsers.includes(u(req.user)._id)) {
            res.status(400).send("User is not registered for this event");
            return;
        }

        // update the registeredUsers field of the current event in the db
        Event.findByIdAndUpdate(
            { _id: req.params.eventId }, // getting event by id
            { $pull: { registeredUsers: u(req.user)._id } }, // pulling the user from registeredUsers array
            (err) => {
                if (err) {
                    err.name === "CastError"
                        ? res.status(404).send("Event not found")
                        : res.status(500).send(err.message);
                    return;
                }
                res.status(200).send(
                    "Successfully unregistered user from event"
                );
            }
        );
    }
);

// DELETE request for deleting an existing event
eventRouter.delete(
    "/event/:eventId", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        // check if the user is the host of the event or a moderator
        const queryHost = await Event.findById(
            { _id: req.params.eventId },
            "hostUser"
        );
        if (
            queryHost.hostUser._id.toString() !== u(req.user)._id.toString() &&
            !u(req.user).moderator
        ) {
            res.status(401).send("Unauthorized - Not the host of this event");
            return;
        }

        // delete the event from the db
        Event.findByIdAndRemove({ _id: req.params.eventId }, null, (err) => {
            if (err) {
                err.name === "CastError"
                    ? res.status(404).send("Event not found")
                    : res.status(500).send(err.message);
                return;
            }
            res.status(200).send("Successfully deleted event");
        });
    }
);

// PUT request for editing an event
eventRouter.put(
    "/event/:eventId", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    body("eventTitle").trim().escape(),
    body("description").trim().escape(),
    body("location").trim().escape(),
    body("startTime").trim().escape(),
    body("duration").trim().escape().isInt({ min: 1, max: 1000 }),
    body("transportInfo").trim().escape(),
    body("maxCapacity").trim().escape().isInt({ min: 1, max: 100 }),
    async (req: Request, res: Response) => {
        // check if the user is the host of the event or a moderator
        const queryHost = await Event.findById(
            { _id: req.params.eventId },
            "hostUser"
        );
        if (
            queryHost.hostUser._id.toString() !== u(req.user)._id.toString() &&
            !u(req.user).moderator
        ) {
            res.status(401).send("Unauthorized - Not the host of this event");
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
        Event.findByIdAndUpdate(
            { _id: req.params.eventId }, // getting event by id
            {
                $set: {
                    eventTitle: req.body.eventTitle,
                    description: req.body.description,
                    location: req.body.location,
                    startTime: startTime,
                    duration: req.body.duration,
                    transportInfo: req.body.transportInfo,
                    maxCapacity: req.body.maxCapacity,
                },
            },
            (err) => {
                if (err) {
                    err.name === "CastError"
                        ? res.status(404).send("Event not found")
                        : res.status(500).send(err.message);
                    return;
                }
                res.status(200).send("Successfully updated event");
            }
        );
    }
);

export default eventRouter;
