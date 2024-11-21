import express from "express";
import passport from "passport";
import { ProfileController } from "../controllers/ProfileController";
import { container } from "tsyringe";
import { authConfig } from "../utils/auth.config";
import { User } from "../database/models/user.model";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { CustomJwtPayload } from "../types/express";
const router = express.Router();
const profileController = container.resolve(ProfileController);
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authConfig.jwtSecret,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (jwtPayload: CustomJwtPayload, done) => {
    try {
      console.log("JWT Payload:", jwtPayload);
      console.log("Searching for user with ID:", jwtPayload.id);

      const user = await User.findById(jwtPayload.id); // Replace `id` with your token payload's identifier field
      if (!user) {
        console.log("No user found for this ID");
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => profileController.getUserProfile(req, res)
);

export default router;
