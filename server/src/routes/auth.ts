import { Request, Response, Router } from "express";
import passport from "passport";

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
  res.status(401).json({
    success: false,
    message: "user failed to authenticate",
  });
});

// when logout, redirect to client
authRouter.get("/logout", (req: Request, res: Response) => {
  req.logout();
  res.redirect(process.env.CLIENT_HOME_PAGE_URL || "/");
});

// auth with google
authRouter.get(
  "/google",
  passport.authenticate("google", {
    hd: "brown.edu", // limits the authentication to brown.edu addresses
    scope: ["profile", "email"],
  })
);

// redirect to home page after successfully login via google
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_HOME_PAGE_URL || "/",
    failureMessage: "/auth/login/failed",
  })
);

export default authRouter;
