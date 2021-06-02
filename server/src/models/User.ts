import { model, Schema, Document } from "mongoose";

// MongoDB User Object Interface
export interface IUser extends Document {
    googleId: string;
    displayName: string;
    email: string;
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
});

const User = model<IUser>("User", UserSchema);
export default User;
