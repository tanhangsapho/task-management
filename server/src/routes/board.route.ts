import express from "express";
import { container } from "tsyringe";
import { BoardController } from "../controllers/board.controller";

const boardRouter = express.Router();
const boardController = container.resolve(BoardController);
boardRouter.post("/", boardController.createBoard.bind(boardController));
boardRouter.get(
  "/user/:id",
  boardController.getBoardsByUserId.bind(boardController)
);
boardRouter.get("/:id", boardController.getBoardById.bind(boardController));
boardRouter.patch(
  "/:id",
  boardController.updateBoardById.bind(boardController)
);
boardRouter.delete(
  "/:id",
  boardController.deleteBoardById.bind(boardController)
);
boardRouter.get("/", boardController.getAllBoard.bind(boardController));

export default boardRouter;
