require("dotenv").config();

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface IBoard {
  _id: string;
  title: string;
  description?: string;
  background: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const API_ENDPOINTS = {
  BOARDS: `${API_URL}/api/board`,
  BOARD: (id: string) => `/api/boards/${id}`,
} as const;

export const boardsApi = {
  getAll: async () => {
    const response = await axios.get<IBoard[]>(API_ENDPOINTS.BOARDS);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get<IBoard>(API_ENDPOINTS.BOARD(id));
    return response.data;
  },

  create: async (data: IBoard) => {
    const response = await axios.post<IBoard>(API_ENDPOINTS.BOARDS, data);
    return response.data;
  },

  // update: async (id: string, data: UpdateBoardDTO) => {
  //   const response = await axios.patch<IBoard>(API_ENDPOINTS.BOARD(id), data);
  //   return response.data;
  // },

  delete: async (id: string) => {
    await axios.delete(API_ENDPOINTS.BOARD(id));
  },
};
