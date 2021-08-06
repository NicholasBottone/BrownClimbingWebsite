import { Router, Request, Response, NextFunction } from "express";
import { Error } from "mongoose";
import { authCheck } from "../middleware/auth";
import { body } from "express-validator";
import Event from "../models/Event";
const eventRouter = Router();

// GET request that retrieves events, populates with User Schema, and sorts start time of event
eventRouter.get(
    "/events",
    (_req: Request, res: Response, _next: NextFunction) => {
        Event.find((err: Error, events) => {
            if (err) console.log(err); // TODO: figure out proper error handling
            return res.json({ events });
        })
            .populate("hostUser")
            .sort([["startTime", -1]]);
    }
);

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
    body("maxCapacityAsNumber").trim().escape().isNumeric(),
    (req: Request, res: Response, _next: NextFunction) => {
        // Sanitize fields before creating new Event
        //TODO: convert the date to JS date (could use native JS API or Moment)
        console.log(req.body);
        const event = new Event({
            eventTitle: req.body.eventTitle,
            description: req.body.description,
            hostUser: req.user, // TODO: Extract user properly (depending on final schema choice)
            //  location: req.body.location,
            startTime: req.body.startTime,
            eventDate: req.body.eventDate,
            durationMinutes: parseInt(req.body.durationAsNumber),
            transportInfo: req.body.transportInfo,
            maxCapacity: parseInt(req.body.maxCapacityAsNumber),
            //   registeredUsers: [req.user],
        });

        event.save((err: Error) => {
            if (err) console.log(err); // TODO: proper error handling
            res.status(200).json({
                event,
                message: "Event created successfully",
            });
        });
    }
);

/*
Example JSON for adding user:
    eventID:
	use req.user field
	go into registered users field in mongoDB database w/ eventID and append req.user if not already registered
	check maxCapacity isn't reached

Example JSON for updating existing event:
	check if event exists using eventID
	check if user that sent request is the host user using mongoDB stuff _id of user == host user id (findByID)
	then replace event stuff using whatever we find
	const event = await mongoose.findByID(req.body.eventID)
*/

eventRouter.put(
    "/events/:eventid", // :eventid is a placeholder and this value can be accessed by req.params.eventid (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response, _next: NextFunction) => {
        if (!req.user) {
            return res.status(400).json({
                message: "Did not find a user",
            });
        }
        // find the registered users field of the current event
        const query = await Event.findById(
            { _id: req.params.eventid },
            "registeredUsers"
        );
        // if the registeredUsers array does not already include the user that wants to register
        if (
            req.body.user._id &&
            query.registeredUsers.includes(req.body.user._id)
        ) {
            return res.status(400).json({
                message: "User is already registered for this event",
            });
        }
        // user does not exist in registeredUsers so we can proceed
        else {
            const updateRes = await Event.findByIdAndUpdate(
                { _id: req.params.eventid },
                { $push: { registeredUsers: req.body.user } },
                { new: true },
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            err,
                        });
                    }
                    console.log(result);
                    return res.status(200).json({
                        message: "Sucessfully added user",
                    });
                }
            );
            return updateRes;
        }
    }
);

export default eventRouter;
