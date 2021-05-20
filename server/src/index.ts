//import * as dotenv from "dotenv";
//import path from "path";
//dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (process.env.NODE_ENV !== "production") {
    const path = require("path");
    require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
}

import express, { Request, Response } from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth";
import { authCheck } from "./middleware/auth";
import session from "express-session";
import MongoStore from "connect-mongo";

import * as passportConfig from "./config/passport";
import { mongoConnection } from "./config/mongo";
passportConfig;

// main function
const main = () => {
    const app = express();

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
                mongoOptions: { useUnifiedTopology: true },
            }),
        })
    );

    app.use(cookieParser());

    // initialize and set up passport to use sessions
    app.use(passport.initialize());
    app.use(passport.session());

    // set up cors
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

    // default route to check if user is authenticated
    app.get("/", authCheck, (req: Request, res: Response) => {
        res.status(200).json({
            authenticated: true,
            message: "user successfully authenticated",
            user: req.user,
            cookies: req.cookies,
        });
    });

    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
};
main();
