import mongoose from "mongoose";

// connect to mongoDB
export function mongoConnection() {
    mongoose.connect(process.env.MONGODB_URI || "", () => {
        console.log("connected to mongodb");
    });
}

export function mongoDisconnection() {
    mongoose.disconnect();
}
