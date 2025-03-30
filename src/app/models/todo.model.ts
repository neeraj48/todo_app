export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  status: 'pending' | 'in-progress' | 'completed';
}
