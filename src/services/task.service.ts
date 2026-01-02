// src/services/task.service.ts

import { taskRepository, Task } from "../repositories/task.repository";
import { AppError } from "../errors/AppError";
import { CreateTaskDTO, UpdateTaskDTO } from "../dtos/task.dto";

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

  createTask(data: CreateTaskDTO): Task {
    return taskRepository.create({
      title: data.title,
      completed: data.completed ?? false,
    });
  },

  updateTask(id: number, data: UpdateTaskDTO): Task {
    const updated = taskRepository.update(id, {
      title: data.title ?? "",
      completed: data.completed ?? false,
    });

    if (!updated) {
      throw new AppError("Task not found", 404);
    }

    return updated;
  },

  deleteTask(id: number): void {
    const deleted = taskRepository.delete(id);

    if (!deleted) {
      throw new AppError("Task not found", 404);
    }
  },
};
