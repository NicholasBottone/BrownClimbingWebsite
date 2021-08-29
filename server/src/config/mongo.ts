import mongoose from "mongoose";

// connect to mongoDB
export function mongoConnection() {
    mongoose.connect(
        process.env.MONGODB_URI || "",
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        },
        () => {
            console.log("connected to mongodb");
        }
    );
}
