// src/controllers/task.controller.ts

import { Request, Response } from "express";
import { taskService } from "../services/task.service";

export const taskController = {
  list(req: Request, res: Response) {
    const search = req.query.search as string | undefined;
    const tasks = taskService.getTasks(search);

    res.json({ tasks });
  },

  getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const task = taskService.getTaskById(id);

    res.json({ task });
  },

  create(req: Request, res: Response) {
    const task = taskService.createTask(req.body);

    res.status(201).json({ task });
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const task = taskService.updateTask(id, req.body);

    res.json({ task });
  },

  delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    taskService.deleteTask(id);

    res.json({
      message: `Task with id ${id} deleted`,
    });
  },
};
