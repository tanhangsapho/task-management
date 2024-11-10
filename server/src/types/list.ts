export interface IList {
  _id?: string;
  title: string;
  boardId: string;
  position: number;
  cards: string[]; // Reference to Card IDs
  createdAt?: Date;
  updatedAt?: Date;
}
