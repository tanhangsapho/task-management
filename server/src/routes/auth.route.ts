import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";
import { authConfig } from "../utils/auth.config";

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
        return done(null, profile);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

router.post("/login", authController.login.bind(authController));
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  authController.handleGoogleCallback.bind(authController)
);

export { router as authRoutes };
