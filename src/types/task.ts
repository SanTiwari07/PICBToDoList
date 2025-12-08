export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface Column {
  id: Priority;
  title: string;
  tasks: Task[];
}
