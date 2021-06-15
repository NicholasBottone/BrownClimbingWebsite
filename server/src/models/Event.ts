import { model, Schema } from "mongoose";

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
        type: String, // TODO: Find a way to store User type (or perhaps string id)
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
        type: [String], // TODO: Find a way to store User types (or perhaps string ids)
        required: true,
    },
});

const Event = model("Event", EventSchema);
export default Event;
