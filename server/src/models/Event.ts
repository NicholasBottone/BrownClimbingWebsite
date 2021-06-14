import { model, Schema} from "mongoose";
import User from "./User";

const EventSchema =  new Schema({
	eventTitle: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	hostUser: {
		type: User,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	startTime: {
		type: Date,
		required: true,
	},
	durationMintues: {
		type: Number,
		required: true,
	},
	transportInfo: {
		type: String,
		required: true,
	},
	maxCapacity: {
		type: Number,
		required: true,
	},
	registeredUsers: {
		type: [User],
		required: true,
	},
})

const Event = model("Event", EventSchema)
export default Event;