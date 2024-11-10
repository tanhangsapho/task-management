import express from "express";
import { container } from "tsyringe";
import { BoardController } from "../controllers/board.controller";

const boardRouter = express.Router();
const boardController = container.resolve(BoardController);

boardRouter.post("/", boardController.createBoard);
boardRouter.get("/user/:id", boardController.getBoardsByUserId);
boardRouter.get("/:id", boardController.getBoardById);
boardRouter.patch("/:id", boardController.updateBoardById);
boardRouter.delete("/:id", boardController.deleteBoardById);
boardRouter.get("/", boardController.getAllBoard);

export default boardRouter;
