// src/routes/tasks.ts

import { Router } from "express";
import { auth } from "../middleware/auth";
import { validate } from "../validation/validate";
import {
  taskIdParamSchema,
  taskQuerySchema,
  createTaskSchema,
  updateTaskSchema,
} from "../validation/task.schema";
import { taskController } from "../controllers/task.controller";

export const taskRouter = Router();

/**
 * Public routes
 */
taskRouter.get(
  "/",
  validate({ query: taskQuerySchema }),
  taskController.list
);

taskRouter.get(
  "/:id",
  validate({ params: taskIdParamSchema }),
  taskController.getById
);

/**
 * Protected routes
 */
taskRouter.post(
  "/",
  auth,
  validate({ body: createTaskSchema }),
  taskController.create
);

taskRouter.put(
  "/:id",
  auth,
  validate({
    params: taskIdParamSchema,
    body: updateTaskSchema,
  }),
  taskController.update
);

taskRouter.delete(
  "/:id",
  auth,
  taskController.delete
);
