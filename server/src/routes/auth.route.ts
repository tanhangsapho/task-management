import express from "express";
import passport, { Profile } from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";
import { authConfig } from "../utils/auth.config";
import axios from "axios";
import { IGoogleProfile } from "../database/repo/interface/user.interface";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();
const authController = container.resolve(AuthController);
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many login attempts from this IP, please try again later.",
});

passport.use(
  new GoogleStrategy(
    {
      clientID: authConfig.googleClientId!,
      clientSecret: authConfig.googleClientSecret!,
      callbackURL: authConfig.callbackURL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleProfile: IGoogleProfile = {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails || [],
          photos: profile.photos,
        };
        return done(null, googleProfile);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: authConfig.githubClientId!,
      clientSecret: authConfig.githubClientSecret!,
      callbackURL: authConfig.githubCallbackURL,
      scope: ["user:email"], // Request access to private email
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        // Check if emails are available in profile
        if (!profile.emails || profile.emails.length === 0) {
          // Fetch private emails using GitHub API
          const { data } = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          const primaryEmail = data.find(
            (email: any) => email.primary && email.verified
          );
          if (primaryEmail) {
            profile.emails = [{ value: primaryEmail.email }];
          }
        }

        return done(null, profile); // Proceed with updated profile
      } catch (error) {
        return done(error);
      }
    }
  )
);

router.get(
  "/google",
  limiter,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  limiter,
  passport.authenticate("google", { session: false }),
  authController.handleGoogleCallback.bind(authController)
);

router.get(
  "/github",
  limiter,
  passport.authenticate("github", { scope: ["user:email"] })
);

router.post(
  "/refresh-token",
  limiter,
  authController.refreshToken.bind(authController)
);
router.post(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController)
);
router.get(
  "/github/callback",
  limiter,
  passport.authenticate("github", { session: false }),
  authController.handleGithubCallback.bind(authController)
);

export { router as authRoutes };

// router.post("/register", authController.register.bind(authController));

// router.get("/verify-email", authController.verifyEmail.bind(authController));
// router.post("/login", limiter, authController.login.bind(authController));
