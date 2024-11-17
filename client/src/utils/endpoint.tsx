import { API_ENDPOINTS, IBoard } from "@/lib/api/board";

export const fetchBoards = async (): Promise<IBoard[]> => {
  const { data } = await axios.get<IBoard[]>(API_ENDPOINTS.BOARDS); // Explicitly typing the response
  return data;
};
