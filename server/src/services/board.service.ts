import { inject, injectable } from "tsyringe";
import { BoardRepo } from "../database/repo/board.repo";
import { IBoard } from "../database/models/board.model";

@injectable()
export class BoardService {
  constructor(@inject(BoardRepo) private readonly boardRepo: BoardRepo) {}
  async createBoard(boardData: IBoard): Promise<IBoard> {
    try {
      return await this.boardRepo.createBoard(boardData);
    } catch (error) {
      throw error;
    }
  }

  async getBoardsByUserId(userId: string) {
    try {
      return await this.boardRepo.getBoardsByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async getBoardById(boardId: string): Promise<IBoard | null> {
    try {
      return await this.boardRepo.getBoardById(boardId);
    } catch (error) {
      throw error;
    }
  }

  async updateBoardById(
    boardId: string,
    boardData: IBoard
  ): Promise<IBoard | null> {
    try {
      return await this.boardRepo.updateBoardById(boardId, boardData);
    } catch (error) {
      throw error;
    }
  }
  async deleteBoardById(boardId: string): Promise<void> {
    try {
      return await this.boardRepo.deleteBoardById(boardId);
    } catch (error) {
      throw error;
    }
  }
  async getAllBoard(): Promise<IBoard[]> {
    try {
      return await this.boardRepo.getAllBoard();
    } catch (error) {
      throw error;
    }
  }
}
