import { Router, Request, Response } from "express";
import { modCheck } from "src/middleware/auth";
import Event from "src/models/Event";
import User from "src/models/User";
import { EventType, UserType } from "src/types";

const adminRouter = Router();

// GET request that returns list of all users
adminRouter.get("/users", modCheck, (_req: Request, res: Response) => {
    User.find((err: Error, users: UserType[]) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }
        res.json({ users });
    });
});

// GET request that returns list of all events
adminRouter.get("/events", modCheck, (_req: Request, res: Response) => {
    Event.find((err: Error, events: EventType[]) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }
        res.json({ events });
    })
        .populate("hostUser")
        .populate("registeredUsers")
        .sort([["startTime", -1]]);
});

export default adminRouter;
