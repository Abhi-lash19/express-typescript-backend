// src/controllers/task.controller.ts

import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import { sendSuccess } from "../utils";
import {
  toTaskResponseDTO,
  toTaskListResponseDTO,
} from "../dtos/task.mapper";

export const taskController = {
  async list(req: Request, res: Response) {
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { tasks, total } = await taskService.getTasks(
      req.supabase!,
      req.user!.id,
      search,
      page,
      limit
    );

    return sendSuccess(
      res,
      { tasks: toTaskListResponseDTO(tasks) },
      200,
      { page, limit, total }
    );
  },

  async getById(req: Request, res: Response) {
    const task = await taskService.getTaskById(
      req.supabase!,
      req.user!.id,
      Number(req.params.id)
    );

    return sendSuccess(res, {
      task: toTaskResponseDTO(task),
    });
  },

  async create(req: Request, res: Response) {
    const task = await taskService.createTask(
      req.supabase!,
      req.user!.id,
      req.body
    );

    return sendSuccess(res, { task }, 201);
  },

  async update(req: Request, res: Response) {
    const task = await taskService.updateTask(
      req.supabase!,
      req.user!.id,
      Number(req.params.id),
      req.body
    );

    return sendSuccess(res, { task });
  },

  async delete(req: Request, res: Response) {
    await taskService.deleteTask(
      req.supabase!,
      req.user!.id,
      Number(req.params.id)
    );

    return sendSuccess(res, {
      message: "Task deleted successfully",
    });
  },
};
