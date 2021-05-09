import mongoose, { Schema, Document } from "mongoose";

// MongoDB User Object Interface
export interface IUser extends Document {
  // id: string;
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export model with IUser interface
export default mongoose.model<IUser>("User", UserSchema);
