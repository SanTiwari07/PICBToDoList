import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Task, Priority } from '@/types/task';

const STORAGE_KEY = 'taskora-tasks';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getInitialTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Filter out any tasks with 'calendar' priority from old data
      return parsed.filter((t: Task) => ['high', 'medium', 'low'].includes(t.priority));
    } catch {
      return [];
    }
  }
  // Demo tasks
  return [
    {
      id: generateId(),
      title: 'Fix critical bug in auth',
      description: 'Users unable to reset passwords - high priority fix needed',
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Code review',
      description: 'Review pull requests from team members',
      priority: 'high',
      completed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Update documentation',
      description: 'Add API documentation for new endpoints',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Team standup meeting',
      description: 'Daily sync with the engineering team at 10 AM',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Refactor legacy code',
      description: 'Clean up old utility functions when time permits',
      priority: 'low',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
};

interface TaskContextType {
  tasks: Task[];
  isLoaded: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  moveTask: (taskId: string, newPriority: Priority) => void;
  getTasksByPriority: (priority: Priority) => Task[];
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTasks(getInitialTasks());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const moveTask = useCallback((taskId: string, newPriority: Priority) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  }, []);

  const getTasksByPriority = useCallback((priority: Priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoaded,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      moveTask,
      getTasksByPriority,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
