import { Request, Response, Router } from "express";
import passport from "passport";
import { authCheck } from "../middleware/auth";

const authRouter = Router();

// when login success, retrive user info
authRouter.get("/login/success", (req: Request, res: Response) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "user authentication successful",
            user: req.user,
            cookies: req.cookies,
        });
    }
});

// when login fails, send failed message
authRouter.get("/login/failed", (req: Request, res: Response) => {
    console.log(req);
    res.status(401).json({
        success: false,
        message: "user failed to authenticate",
    });
});

// when logout, redirect to client
authRouter.get("/logout", (req: Request, res: Response) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL || "/");
});

// auth with google
authRouter.get(
    "/google",
    passport.authenticate("google", {
        hd: "brown.edu", // limits the authentication to brown.edu addresses
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

// redirect to home page after successfully login via google
authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL || "http://localhost:3000",
        failureMessage: "/auth/login/failed",
    })
);

// just to test if checkAuth actually works
authRouter.get("/check-auth", authCheck, (req: Request, res: Response) => {
    console.log(req.user);
    res.status(200).json({
        success: true,
        message: "user authenticated",
        user: req.user,
    });
});

export default authRouter;
