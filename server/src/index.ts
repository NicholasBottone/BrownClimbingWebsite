import express, { Request, Response } from "express";
import session from "express-session";
import * as dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth";
import { authCheck } from "./middleware/auth";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// main function
const main = () => {
  const app = express();

  // connect to mongoDB
  mongoose.connect(process.env.MONGODB_URI || "", () => {
    console.log("connected to mongodb");
  });

  // cookie session setup
  app.use(
    cookieSession({
      name: "cookie-session",
      keys: [process.env.COOKIE_KEY || "1234"],
      maxAge: 24 * 60 * 60 * 10, // might want to change this value
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
      origin: process.env.CORS_ORIGIN,
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
