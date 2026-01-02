// src/repositories/task.repository.ts

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

let tasks: Task[] = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: false },
];

export const taskRepository = {
  findAll(): Task[] {
    return tasks;
  },

  findBySearch(search: string): Task[] {
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  },

  findById(id: number): Task | undefined {
    return tasks.find((t) => t.id === id);
  },

  create(task: Omit<Task, "id">): Task {
    const newTask: Task = {
      id: tasks.length + 1,
      ...task,
    };

    tasks.push(newTask);
    return newTask;
  },

  update(id: number, update: Omit<Task, "id">): Task | undefined {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return undefined;

    tasks[index] = { id, ...update };
    return tasks[index];
  },

  delete(id: number): boolean {
    const initialLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== id);
    return tasks.length < initialLength;
  },
};

