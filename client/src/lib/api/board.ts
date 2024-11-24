import axiosInstance from "./axiosInstance";

export interface IBoard {
  _id: string;
  title: string;
  description?: string;
  background: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const boardsApi = {
  getAll: async () => {
    const response = await axiosInstance.get<IBoard[]>("/api/board");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<IBoard>(`/api/boards/${id}`);
    return response.data;
  },

  create: async (data: IBoard) => {
    const response = await axiosInstance.post<IBoard>("/api/board", data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/api/boards/${id}`);
  },
};
