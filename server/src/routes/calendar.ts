import { Router, Request, Response, NextFunction } from "express";
import { Error } from "mongoose";
import { authCheck } from "../middleware/auth";
import { body } from 'express-validator';
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
            .populate("User")
            .sort([["startTime", -1]]);
    }
);


// POST request that allows user to input event and handles possible error for ill formatted event
eventRouter.post(
    "/events",
    authCheck,
	body('eventTitle').trim().escape(),
	body('description').trim().escape(),
	body('hostUser').trim().escape(),
	body('location').trim().escape(),
	body('startTime').trim().escape(),
	body('durationAsNumber').trim().escape(),
	body('transportInfo').trim().escape(),
	body('maxCapacityAsNumber').trim().escape().isNumeric(),
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

export default eventRouter;
