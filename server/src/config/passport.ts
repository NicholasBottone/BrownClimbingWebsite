import passport from "passport";
import {
    Profile,
    Strategy as GoogleStrategy,
    VerifyCallback,
} from "passport-google-oauth20";
import User from "../models/User";
import { UserType } from "../types";

export function init() {
    // serialize the user.id to save in the cookie session
    // so the browser will remember the user when login
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    // deserialize the cookieUserId to user in the database
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => {
                done(null, user);
            })
            .catch((err) => {
                console.error(err);
                done(new Error("failed to deserialize an user"));
            });
    });

    // sets up the GoogleStrategy with call back functions
    // call back functions checks if a User exists in the MongoDB collection
    // if not creates new user object otherwise retrieves existing user object
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID || "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                callbackURL: "/auth/google/callback",
            },
            async (
                _accessToken: string,
                _refreshToken: string,
                profile: Profile,
                done: VerifyCallback
            ) => {
                // Error checking
                if (!profile) {
                    done(new Error("Profile is undefined"));
                    return;
                }
                if (profile._json.hd !== "brown.edu") {
                    // ensures email domain is brown.edu
                    done(new Error("Invalid domain!"));
                    return;
                }
                let displayPicURL = "https://i.ibb.co/WKq909Y/profile.webp";
                if (profile.photos) {
                    displayPicURL = profile.photos[0].value;
                }
                // creates a new user object
                const newUser: UserType = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile._json.email,
                    displayPictureURL: displayPicURL,
                };
                try {
                    // searches for user in mongoDB collection by googleId
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // gets user if user exists in mongoDB collection
                        done(null, user);
                    } else {
                        // creates new user if not in mongoDB collection
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        )
    );
}
