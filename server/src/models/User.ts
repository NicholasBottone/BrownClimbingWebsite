import { model, Schema, Document } from "mongoose";

// MongoDB User Object Interface
export interface IUser extends Document {
    _id: string;
    googleId: string;
    displayName: string;
    email: string;
    displayPictureURL: string;
    createdAt: Date;
    lastLoggedIn: Date;
    moderator: boolean;
}

const UserSchema = new Schema({
    googleId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    displayPictureURL: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLoggedIn: {
        type: Date,
        default: Date.now,
    },
    moderator: {
        type: Boolean,
        default: false,
    },
});

const User = model<IUser>("User", UserSchema);
export default User;
