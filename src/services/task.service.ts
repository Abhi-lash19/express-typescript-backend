// src/services/task.service.ts

import { taskRepository, Task } from "../repositories/task.repository";
import { AppError } from "../errors/AppError";
import { CreateTaskDTO, UpdateTaskDTO } from "../dtos/task.dto";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../config/supabase";

export const taskService = {
  async getTasks(
    supabase: SupabaseClient,
    userId: string,
    search?: string,
    page = 1,
    limit = 10
  ): Promise<Task[]> {
    const offset = (page - 1) * limit;

    if (search) {
      return taskRepository.findBySearch(supabase, userId, search, offset, limit);
    }

    return taskRepository.findAll(supabase, userId, offset, limit);
  },

  async getTaskById(supabase: SupabaseClient, userId: string, id: number): Promise<Task> {
    const task = await taskRepository.findById(supabase, userId, id);
    if (!task) throw new AppError("Task not found", 404);
    return task;
  },

  async createTask(
    supabase: SupabaseClient,
    userId: string,
    data: CreateTaskDTO
  ): Promise<Task> {
    return taskRepository.create(supabase, userId, {
      title: data.title,
      completed: data.completed ?? false,
    });
  },

  async updateTask(
    supabase: SupabaseClient,
    userId: string,
    id: number,
    data: UpdateTaskDTO
  ): Promise<Task> {
    const updated = await taskRepository.update(supabase, userId, id, {
      title: data.title ?? "",
      completed: data.completed ?? false,
    });

    if (!updated) throw new AppError("Task not found", 404);
    return updated;
  },

  async deleteTask(supabase: SupabaseClient, userId: string, id: number): Promise<void> {
    const deleted = await taskRepository.delete(supabase, userId, id);
    if (!deleted) throw new AppError("Task not found", 404);
  },
};
