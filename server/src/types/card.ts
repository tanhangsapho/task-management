export interface ICard {
  _id?: string;
  title: string;
  description?: string;
  listId: string;
  boardId: string;
  position: number;
  dueDate?: Date;
  labels?: string[];
  assignedUsers?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
