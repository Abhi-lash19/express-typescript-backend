//src/routes/task.ts

import { Router, Request, Response } from "express";
import { auth } from "../middleware/auth";

export const taskRouter = Router();

/**
 * Public routes
 */
taskRouter.get("/", (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;

  if (search) {
    res.json({
      tasks: [{ id: 1, title: search, completed: false }],
    });
    return;
  }

  res.json({
    tasks: [
      { id: 1, title: "Task 1", completed: false },
      { id: 2, title: "Task 2", completed: false },
    ],
  });
});

taskRouter.get("/:id", (req: Request, res: Response) => {
  const taskId = req.params.id;

  res.json({
    task: { id: taskId, title: `Task ${taskId}`, completed: false },
  });
});

/**
 * Protected routes
 */
taskRouter.post("/", auth, (req: Request, res: Response) => {
  const { title, completed } = req.body;

  res.status(201).json({
    task: { title, completed },
  });
});

taskRouter.put("/:id", auth, (req: Request, res: Response) => {
  const taskId = req.params.id;

  res.json({
    task: {
      id: taskId,
      title: req.body.title,
      completed: req.body.completed,
    },
  });
});

taskRouter.delete("/:id", auth, (req: Request, res: Response) => {
  const taskId = req.params.id;

  res.json({
    message: `Task with id ${taskId} deleted`,
  });
});
