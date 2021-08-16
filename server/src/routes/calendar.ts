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

// POST request that allows user to input event and handles possible error for ill formatted event
eventRouter.post(
    "/events",
    authCheck,
    body("eventTitle").trim().escape(),
    body("description").trim().escape(),
    body("hostUser").trim().escape(),
    body("location").trim().escape(),
    body("startTime").trim().escape(),
    body("durationAsNumber").trim().escape(),
    body("transportInfo").trim().escape(),
    body("maxCapacityAsNumber").trim().escape().isInt({ min: 1, max: 100 }),
    (req: Request, res: Response) => {
        // Sanitize fields before creating new Event
        //TODO: convert the date to JS date (could use native JS API or Moment)
        const event = new Event({
            eventTitle: req.body.eventTitle,
            description: req.body.description,
            hostUser: req.user, // TODO: Extract user properly (depending on final schema choice)
            location: req.body.location,
            startTime: req.body.startTime,
            eventDate: req.body.eventDate,
            durationMinutes: parseInt(req.body.durationAsNumber),
            transportInfo: req.body.transportInfo,
            maxCapacity: parseInt(req.body.maxCapacityAsNumber),
            // registeredUsers: [req.user], // should we or should we not include the user that hosted the event in the registeredUsers thing
        });

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

// user registering for event
eventRouter.put(
    "/event/:eventId/register", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        // checking if received user object from frontend (not receiving means something went wrong)
        if (!req.body.user) {
            res.status(400).json({
                message: "User information not passed with request",
            });
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

// user unregistering from event
eventRouter.put(
    "/event/:eventId/unregister", // :eventId is a placeholder and this value can be accessed by req.params.eventId (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response) => {
        // checking if received user object from frontend (not receiving means something went wrong)
        if (!req.body.user) {
            res.status(400).json({
                message: "User information not passed with request",
            });
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

/**
 * assume you can access the eventId with req.params.eventId
 * assume that the req.body looks the exact same as in the POST request for creating new events
 * TODO: update the event with the new changes (could probably just update all the fields with everything you get in req.body). Could just create a new Event like I did in the POST request and pass it in as the second argument
 *      to the findByIdAndUpdate method
 * TODO: make sure the person trying to make the put request is in fact the hostUser of the event (look at how I used query in the above PUT request to access the registeredUsers field,
 *      will probably want to do something similar for the hostUser field and then compare that user that made the request (assume req.body.user) has the same ._id has the hostUser)
 */
// editing an event by its host user
// TODO: uncomment the method below and fill it in :)
// eventRouter.put(
//     "/events/:eventId/edit",
//     authCheck,
//     async (req: Request, res: Response, _next: NextFunction) => {
//         // TODO: fill this in
//     }
// );
export default eventRouter;
