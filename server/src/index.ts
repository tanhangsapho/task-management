import "reflect-metadata";
import express from "express";
import { run } from "./utils/server";
import boardRouter from "./routes/board.route";
import { authRoutes } from "./routes/auth.route";
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRoutes);
app.use("/api/board", boardRouter);

run();
