// TODO: Look into Express-Validator (https://express-validator.github.io/)

import { Router, Request, Response, NextFunction } from "express";
import { EventType } from "src/types";
import Event from "../models/Event"
const eventRouter = Router();

eventRouter.get("/events", (_req: Request, res: Response, next: NextFunction) => {
	Event.find((err, events) => {
		if (err) next(err);
		return res.json({ events });
	}).populate("User").sort([["startTime", -1]]);
})

eventRouter.post("/events", (req: Request, res: Response, next: NextFunction) => {
	const event = new Event({ 
		eventTitle: req.body.eventTitle,
		description: req.body.description,
		hostUser: req.body.hostUser,
		location: req.body.location,
		startTime: req.body.startTime,
		durationMinutes: req.body.durationMinutes,
		transportInfo: req.body.transportInfo,
		maxCapacity: req.body.maxCapacity,
		registeredUsers: req.body.registeredUsers,
	})

	event.save((err : any) => {
		if (err) next(err);
		res.status(200).json({ event, message: "Event created successfully "});
	})
})

export default eventRouter
