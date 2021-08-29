import { Router, Request, Response } from "express";
import { Error } from "mongoose";
import { authCheck } from "../middleware/auth";
import { body } from "express-validator";
import Event from "../models/Event";
import { EventType } from "src/types";

const eventRouter = Router();

// GET request that retrieves events, populates with User Schema, and sorts start time of event
eventRouter.get("/events", (_req: Request, res: Response) => {
    Event.find((err: Error, events: EventType[]) => {
        if (err) {
            console.error(err); // TODO: figure out proper error handling
            res.status(500).send(err);
            return;
        }
        res.json({ events });
    })
        .populate("hostUser")
        .populate("registeredUsers")
        .sort([["startTime", -1]]);
});

// GET request that retrieves a specific event
eventRouter.get("/event/:eventId", (req: Request, res: Response) => {
    Event.findById(req.params.eventId, (err: Error, event: EventType) => {
        if (err) {
            console.error(err); // TODO: figure out proper error handling
            res.status(500).send(err);
            return;
        }
        res.json({ event });
    })
        .populate("hostUser")
        .populate("registeredUsers");
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
                console.error(err); // TODO: figure out proper error handling
                res.status(500).send(err);
                return;
            }
            res.status(200).json({
                event,
                message: "Event created successfully",
            });
        });
    }
);

/*
Example JSON for adding user:
    eventId:
	use req.user field
	go into registered users field in mongoDB database w/ eventId and append req.user if not already registered
	check maxCapacity isn't reached

Example JSON for updating existing event:
	check if event exists using eventId
	check if user that sent request is the host user using mongoDB stuff _id of user == host user id (findByID)
	then replace event stuff using whatever we find
	const event = await mongoose.findByID(req.body.eventId)
*/

// PUT request for user registering for event
eventRouter.put(
    "/event/:eventId/register", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        // checking if received user object from frontend (not receiving means something went wrong)
        if (!req.body.user) {
            res.status(400).json({
                message: "User information not passed with request",
            });
            return;
        }

        // check if the user is already registered for the event
        const queryRegisteredUsers = await Event.findById(
            { _id: req.params.eventId },
            "registeredUsers"
        );
        if (queryRegisteredUsers.registeredUsers.includes(req.body.user._id)) {
            res.status(400).json({
                message: "User is already registered for this event",
            });
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
            res.status(400).json({
                message: "Max event capacity reached",
            });
            return;
        }
        // TODO: clean up the if else statements (could probably be more concise and figure out how to handle any errors)

        // update the registeredUsers field of the current event in the db
        Event.findByIdAndUpdate(
            { _id: req.params.eventId }, // getting event by id
            { $push: { registeredUsers: req.body.user } }, // pushing the user into registeredUsers array
            (err) => {
                if (err) {
                    console.error(err); // TODO: figure out proper error handling
                    res.status(500).send(err);
                    return;
                }
                res.status(200).json({
                    message: "Successfully registered user for event",
                });
            }
        );
    }
);

// PUT request for user unregistering from event
eventRouter.put(
    "/event/:eventId/unregister", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        // checking if received user object from frontend (not receiving means something went wrong)
        if (!req.body.user) {
            res.status(400).json({
                message: "User information not passed with request",
            });
            return;
        }

        // check if the user is already registered for the event
        const queryRegisteredUsers = await Event.findById(
            { _id: req.params.eventId },
            "registeredUsers"
        );
        if (!queryRegisteredUsers.registeredUsers.includes(req.body.user._id)) {
            res.status(400).json({
                message: "User is not registered for this event",
            });
            return;
        }

        // update the registeredUsers field of the current event in the db
        Event.findByIdAndUpdate(
            { _id: req.params.eventId }, // getting event by id
            { $pull: { registeredUsers: req.body.user._id } }, // pulling the user from registeredUsers array
            (err) => {
                if (err) {
                    console.error(err); // TODO: figure out proper error handling
                    res.status(500).send(err);
                    return;
                }
                res.status(200).json({
                    message: "Successfully unregistered user from event",
                });
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
        if (queryHost.hostUser !== req.user) {
            // FIXME: not working, need to compare express user object to mongo user object
            // TODO: check if user is a moderator
            res.status(401).send("Unauthorized - Not the host of this event");
            return;
        }

        // delete the event from the db
        Event.findByIdAndRemove({ _id: req.params.eventId }, null, (err) => {
            if (err) {
                console.error(err); // TODO: figure out proper error handling
                res.status(500).send(err);
                return;
            }
            res.status(200).json({
                message: "Successfully deleted event",
            });
        });
    }
);

/**
 * TODO: update the event with the new changes (could probably just update all the fields with everything you get in req.body). Could just create a new Event like I did in the POST request and pass it in as the second argument
 *      to the findByIdAndUpdate method
 * TODO: make sure the person trying to make the put request is in fact the hostUser of the event (look at how I used query in the above PUT request to access the registeredUsers field,
 *      will probably want to do something similar for the hostUser field and then compare that user that made the request (assume req.body.user) has the same ._id has the hostUser)
 */

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
        if (queryHost.hostUser !== req.user) {
            // FIXME: not working, need to compare express user object to mongo user object
            // TODO: check if user is a moderator
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
                    console.error(err); // TODO: figure out proper error handling
                    res.status(500).send(err);
                    return;
                }
                res.status(200).json({
                    message: "Successfully updated event",
                });
            }
        );
    }
);

export default eventRouter;
