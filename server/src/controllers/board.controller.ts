import { inject, injectable } from "tsyringe";
import { BoardService } from "../services/board.service";
import { Request, Response } from "express";
@injectable()
export class BoardController {
  constructor(
    @inject(BoardService) private readonly boardService: BoardService
  ) {}

  async createBoard(req: Request, res: Response): Promise<void> {
    try {
      const board = await this.boardService.createBoard(req.body);
      res.status(201).json({ message: "Create Successfully ", data: board });
    } catch (error) {
      throw error;
    }
  }

  async getBoardsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const boards = await this.boardService.getBoardsByUserId(req.params.id);
      res.status(200).json({ message: "Get Successfully ", data: boards });
    } catch (error) {
      throw error;
    }
  }

  async getBoardById(req: Request, res: Response): Promise<void> {
    try {
      const board = await this.boardService.getBoardById(req.params.id);
      res.status(200).json({ message: "Get Successfully ", data: board });
    } catch (error) {
      throw error;
    }
  }

  async updateBoardById(req: Request, res: Response): Promise<void> {
    try {
      const board = await this.boardService.updateBoardById(
        req.params.id,
        req.body
      );
      res.status(200).json({ message: "Update Successfully ", data: board });
    } catch (error) {
      throw error;
    }
  }
  async deleteBoardById(req: Request, res: Response): Promise<void> {
    try {
      await this.boardService.deleteBoardById(req.params.id);
      res.status(204).json({ message: "Delete Successfully " });
    } catch (error) {
      throw error;
    }
  }
  async getAllBoard(req: Request, res: Response): Promise<void> {
    try {
      const boards = await this.boardService.getAllBoard();
      res.status(200).json({ message: "Get All Successfully ", data: boards });
    } catch (error) {
      throw error;
    }
  }
}
