import { injectable } from "tsyringe";
import { Board, IBoard } from "../models/board.model";
@injectable()
export class BoardRepo {
  async createBoard(boardData: IBoard): Promise<IBoard> {
    try {
      const board = await Board.create(boardData);
      return board;
    } catch (error) {
      console.error("Error creating board:", error);
      throw error;
    }
  }
  async getBoardsByUserId(userId: string) {
    try {
      const boards = await Board.find({ userId: userId }).exec();
      return boards;
    } catch (error) {
      console.error("Error getting boards by user ID:", error);
      throw error;
    }
  }
  async getBoardById(boardId: string): Promise<IBoard | null> {
    try {
      const board = await Board.findById(boardId).exec();
      return board;
    } catch (error) {
      console.error("Error getting board by ID:", error);
      throw error;
    }
  }
  async updateBoardById(
    boardId: string,
    boardData: IBoard
  ): Promise<IBoard | null> {
    try {
      const updatedBoard = await Board.findByIdAndUpdate(boardId, boardData, {
        new: true,
      }).exec();
      return updatedBoard;
    } catch (error) {
      console.error("Error updating board by ID:", error);
      throw error;
    }
  }
  async deleteBoardById(boardId: string): Promise<void> {
    try {
      await Board.findByIdAndDelete(boardId).exec();
    } catch (error) {
      console.error("Error deleting board by ID:", error);
      throw error;
    }
  }
  async getAllBoard(): Promise<IBoard[]> {
    try {
      const boards = await Board.find().exec();
      return boards;
    } catch (error) {
      console.error("Error getting boards by user ID:", error);
      throw error;
    }
  }
}
