// src/services/task.service.ts

import { taskRepository, Task } from "../repositories/task.repository";
import { AppError } from "../errors/AppError";
import { CreateTaskDTO, UpdateTaskDTO } from "../dtos/task.dto";

export const taskService = {
  async getTasks(search?: string): Promise<Task[]> {
    if (search) {
      return await taskRepository.findBySearch(search);
    }
    return await taskRepository.findAll();
  },

  async getTaskById(id: number): Promise<Task> {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return task;
  },

  async createTask(data: CreateTaskDTO): Promise<Task> {
    return await taskRepository.create({
      title: data.title,
      completed: data.completed ?? false,
    });
  },

  async updateTask(id: number, data: UpdateTaskDTO): Promise<Task> {
    const updated = await taskRepository.update(id, {
      title: data.title ?? "",
      completed: data.completed ?? false,
    });

    if (!updated) {
      throw new AppError("Task not found", 404);
    }

    return updated;
  },

  async deleteTask(id: number): Promise<void> {
    const deleted = await taskRepository.delete(id);

    if (!deleted) {
      throw new AppError("Task not found", 404);
    }
  },
};
