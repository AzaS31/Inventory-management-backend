import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import prisma from "./database.js";
import dotenv from "dotenv";

dotenv.config();

// ===== Google Strategy =====
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const username = profile.displayName || email.split("@")[0];

                let user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            username,
                            googleId: profile.id, 
                        },
                    });
                } else if (!user.googleId) {
                    user = await prisma.user.update({
                        where: { email },
                        data: { googleId: profile.id },
                    });
                }

                return done(null, user);
            } catch (err) {
                console.error("Google Strategy Error:", err);
                return done(err, null);
            }
        }
    )
);

// ===== Facebook Strategy =====
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
            profileFields: ["id", "emails", "displayName"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const username = profile.displayName || email.split("@")[0];

                let user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            username,
                            facebookId: profile.id, 
                        },
                    });
                } else if (!user.facebookId) {
                    user = await prisma.user.update({
                        where: { email },
                        data: { facebookId: profile.id },
                    });
                }

                return done(null, user);
            } catch (err) {
                console.error("Facebook Strategy Error:", err);
                return done(err, null);
            }
        }
    )
);

// ===== Session handling =====
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;