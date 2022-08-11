import { Document, model, Schema } from "mongoose";
import { IUser } from "./User";

export interface IEvent extends Document {
    _id: string;
    eventTitle: string;
    description: string;
    hostUser: IUser;
    location: string;
    startTime: Date;
    durationMinutes: number;
    transportInfo: string;
    registeredUsers: IUser[];
    maxCapacity: number;
}

const EventSchema = new Schema({
    eventTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hostUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
    durationMinutes: {
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
    registeredUsers: [
        { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
});

const Event = model<IEvent>("Event", EventSchema);
export default Event;
