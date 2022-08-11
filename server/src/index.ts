import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import authRouter from "./routes/auth";
import eventRouter from "./routes/calendar";
import adminRouter from "./routes/admin";

import * as passportConfig from "./config/passport";
import { mongoConnection } from "./config/mongo";

// main function
export function main() {
    dotenv.config();
    passportConfig.init();
    const app = express();

    // connect to DB
    mongoConnection();

    // express session
    app.use(
        session({
            secret: process.env.SESSION_SECRET || "",
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 86400000 * 30 }, // 30 days cookie expiry
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI,
            }),
        })
    );

    // parse incoming cookies of html requests
    app.use(cookieParser());
    // parse body of http request
    app.use(express.json());

    // initialize and set up passport to use sessions
    app.use(passport.initialize());
    app.use(passport.session());

    // set up cors to allow us to accept requests from front end client
    app.use(
        cors({
            origin: process.env.CLIENT_URL || "",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
        })
    );

    // set up auth route
    app.use("/auth", authRouter);
    app.use("/calendar", eventRouter);
    app.use("/admin", adminRouter);

    // server starts listening
    const port = Number(process.env.PORT) || 3000;
    const hostname = process.env.HOST || "localhost";
    app.listen(port, hostname, () => {
        console.log(`Server started on http://${hostname}:${port}`);
    });
}
main();
