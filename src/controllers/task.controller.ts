// src/controllers/task.controller.ts

import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import { sendSuccess } from "../utils";

export const taskController = {
  list(req: Request, res: Response) {
    const search = req.query.search as string | undefined;
    const tasks = taskService.getTasks(search);

    return sendSuccess(res, { tasks });
  },

  getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const task = taskService.getTaskById(id);

    return sendSuccess(res, { task });
  },

  create(req: Request, res: Response) {
    const task = taskService.createTask(req.body);

    return sendSuccess(res, { task }, 201);
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const task = taskService.updateTask(id, req.body);

    return sendSuccess(res, { task });
  },

  delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    taskService.deleteTask(id);

    return sendSuccess(res, {
      message: `Task with id ${id} deleted`,
    });
  },
};
