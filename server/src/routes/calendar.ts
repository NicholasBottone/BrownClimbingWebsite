import { Router, Request, Response, NextFunction } from "express";
import { Error } from "mongoose";
import { authCheck } from "../middleware/auth";
import Event from "../models/Event";
const eventRouter = Router();

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

eventRouter.post(
    "/events",
    authCheck,
    (req: Request, _res: Response, _next: NextFunction) => {

        // TODO: Look into Express-Validator (https://express-validator.github.io/)
        // Sanitize fields before creating new Event
        console.log(req.body)

        // const event = new Event({
        //     eventTitle: req.body.eventTitle,
        //     description: req.body.description,
        //     hostUser: req.user, // TODO: Extract user properly (depending on final schema choice)
        //     location: req.body.location,
        //     startTime: req.body.startTime,
        //     durationMinutes: req.body.durationMinutes,
        //     transportInfo: req.body.transportInfo,
        //     maxCapacity: req.body.maxCapacity,
        //     registeredUsers: [req.user],
        // });


        // event.save((err: Error) => {
        //     if (err) console.log(err); // TODO: proper error handling
        //     res.status(200).json({
        //         event,
        //         message: "Event created successfully",
        //     });
        // });
    }
);

export default eventRouter;
