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
            location: req.body.location,
            startTime: req.body.startTime,
            eventDate: req.body.eventDate,
            durationMinutes: parseInt(req.body.durationAsNumber),
            transportInfo: req.body.transportInfo,
            maxCapacity: parseInt(req.body.maxCapacityAsNumber),
            // registeredUsers: [req.user], // should we or should we not include the user that hosted the event in the registeredUsers thing
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

// user registering for event
eventRouter.put(
    "/events/:eventid", // :eventid is a placeholder and this value can be accessed by req.params.eventid (this is the url path from the frontend)
    authCheck,
    async (req: Request, res: Response, _next: NextFunction) => {
        // checking if receieved user object from frontend (not receiving means something went wrong)
        if (!req.body.user) {
            return res.status(400).json({
                error: "Did not find a user",
            });
        }
        // query the db to find the registeredUsers field of the current event
        const queryRegisteredUsers = await Event.findById(
            { _id: req.params.eventid },
            "registeredUsers"
        );
        // if the registeredUsers array does not already include the user that wants to register
        if (queryRegisteredUsers.registeredUsers.includes(req.body.user._id)) {
            return res.status(400).json({
                error: "User is already registered for this event",
            });
        }

        const queryMaxCapacity = await Event.findById(
            { _id: req.params.eventid },
            "maxCapacity"
        );
        // TODO: check that this max capacity test works
        // checking if event is past max capacity
        if (
            queryMaxCapacity.maxCapacity ===
            queryRegisteredUsers.registeredUsers.length
        ) {
            return res.status(400).json({
                error: "Max Capacity Reached",
            });
        }
        // TODO: clean up the if else statements (could probably be more concise and figure out how to handle any errors)
        // TODO: have a check for number of registered users so that we dont exceed capacity!!

        // user does not exist in registeredUsers so we can proceed
        Event.findByIdAndUpdate(
            { _id: req.params.eventid }, // getting event by id
            { $push: { registeredUsers: req.body.user } }, // pushing the user into registeredUsers array
            { new: true }, // findByIdAndUpdate returns the mongoDB object AFTER the update has been applied
            (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err,
                    });
                }
                console.log(result);
                return res.status(200).json({
                    message: "Sucessfully added user",
                });
            }
        );
        return;
    }
);

/**
 * assume you can access the eventid with req.params.eventid
 * assume that the req.body looks the exact same as in the POST request for creating new events
 * TODO: update the event with the new changes (could probably just update all the fields with everything you get in req.body). Could just create a new Event like I did in the POST request and pass it in as the second argument
 *      to the findByIdAndUpdate method
 * TODO: make sure the person trying to make the put request is infact the hostUser of the event (look at how I used query in the above PUT request to access the registeredUsers field,
 *      will probably want to do something similar for the hostUser field and then compare that user that made the request (assume req.body.user) has the same ._id has the hostUser)
 */
// editing an event by its host user
// TODO: uncomment the method below and fill it in :)
// eventRouter.put(
//     "/events/:eventid/edit",
//     authCheck,
//     async (req: Request, res: Response, _next: NextFunction) => {
//         // TODO: fill this in
//     }
// );
export default eventRouter;
