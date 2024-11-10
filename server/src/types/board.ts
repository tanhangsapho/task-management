export interface IBoard {
  _id?: string;
  title: string;
  description?: string;
  userId: Object;
  lists: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
