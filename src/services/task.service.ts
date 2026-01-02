// src/services/task.service.ts

import { taskRepository, Task } from "../repositories/task.repository";
import { AppError } from "../errors/AppError";

export const taskService = {
  getTasks(search?: string): Task[] {
    if (search) {
      return taskRepository.findBySearch(search);
    }
    return taskRepository.findAll();
  },

  getTaskById(id: number): Task {
    const task = taskRepository.findById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return task;
  },

  createTask(data: Omit<Task, "id">): Task {
    return taskRepository.create(data);
  },

  updateTask(id: number, data: Omit<Task, "id">): Task {
    const updatedTask = taskRepository.update(id, data);

    if (!updatedTask) {
      throw new AppError("Task not found", 404);
    }

    return updatedTask;
  },

  deleteTask(id: number): void {
    const deleted = taskRepository.delete(id);

    if (!deleted) {
      throw new AppError("Task not found", 404);
    }
  },
};
