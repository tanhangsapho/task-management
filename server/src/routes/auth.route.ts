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
import { authMiddleware } from "../middlewares/auth.middleware";
import { IGithubProfile } from "../database/repo/interface/user.interface";
import axios from "axios";

const router = express.Router();
const authController = container.resolve(AuthController);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
router.use(limiter);

passport.use(
  new GoogleStrategy(
    {
      clientID: authConfig.googleClientId!,
      clientSecret: authConfig.googleClientSecret!,
      callbackURL: authConfig.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub Profile:", profile);

        return done(null, profile);
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
router.post("/register", authController.register.bind(authController));
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
router.get("/verify-email", authController.verifyEmail.bind(authController));
router.post("/login", limiter, authController.login.bind(authController));

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.handleGoogleCallback.bind(authController)
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.handleGoogleCallback.bind(authController)
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  authController.handleGithubCallback.bind(authController)
);

export { router as authRoutes };
