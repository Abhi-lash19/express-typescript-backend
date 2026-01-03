// src/routes/tasks.ts

import { Router } from "express";
import { validate } from "../validation/validate";
import {
  taskIdParamSchema,
  taskQuerySchema,
  createTaskSchema,
  updateTaskSchema,
} from "../validation/task.schema";
import { taskController } from "../controllers/task.controller";
import { supabaseAuth } from "../middleware/supabaseAuth";

export const taskRouter = Router();

/**
 * ------------------------
 * Protected routes (Supabase Auth)
 * ------------------------
 * All task routes require a valid Supabase JWT.
 * req.user is guaranteed to exist beyond this point.
 */
taskRouter.use(supabaseAuth);

/**
 * List tasks (with optional search + pagination)
 */
taskRouter.get(
  "/",
  validate({ query: taskQuerySchema }),
  taskController.list
);

/**
 * Get task by ID
 */
taskRouter.get(
  "/:id",
  validate({ params: taskIdParamSchema }),
  taskController.getById
);

/**
 * Create task
 */
taskRouter.post(
  "/",
  validate({ body: createTaskSchema }),
  taskController.create
);

/**
 * Update task
 */
taskRouter.put(
  "/:id",
  validate({
    params: taskIdParamSchema,
    body: updateTaskSchema,
  }),
  taskController.update
);

/**
 * Delete task
 */
taskRouter.delete(
  "/:id",
  validate({ params: taskIdParamSchema }),
  taskController.delete
);
