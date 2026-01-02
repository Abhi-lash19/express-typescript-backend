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

    const tasks = await taskService.getTasks(search);

    return sendSuccess(res, {
      tasks: toTaskListResponseDTO(tasks),
    });
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    const task = await taskService.getTaskById(id);

    return sendSuccess(res, {
      task: toTaskResponseDTO(task),
    });
  },

  async create(req: Request, res: Response) {
    const task = await taskService.createTask(req.body);

    return sendSuccess(
      res,
      { task: toTaskResponseDTO(task) },
      201
    );
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    const task = await taskService.updateTask(id, req.body);

    return sendSuccess(res, {
      task: toTaskResponseDTO(task),
    });
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    await taskService.deleteTask(id);

    return sendSuccess(res, {
      message: `Task with id ${id} deleted`,
    });
  },
};
