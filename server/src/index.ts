import "reflect-metadata";
import express from "express";
import { run } from "./utils/server";
import boardRouter from "./routes/board.route";
import { authRoutes } from "./routes/auth.route";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import getConfig from "./utils/config";
import helmet from "helmet";
export const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(
  session({
    secret: getConfig().jwt_secret || "", // Replace with your own secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: getConfig().env === "production" }, // Secure cookies in production
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/board", boardRouter);

run();
