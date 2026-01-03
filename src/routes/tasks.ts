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
 * ALL routes require Supabase authentication
 * Reason:
 * - Tasks are user-owned
 * - RLS depends on authenticated user
 */
taskRouter.use(supabaseAuth);

/**
 * GET /tasks
 * - List tasks (user-scoped)
 * - Supports search + pagination
 */
taskRouter.get(
  "/",
  validate({ query: taskQuerySchema }),
  taskController.list
);

/**
 * GET /tasks/:id
 * - Fetch a single task
 * - Returns 404 if not owned / not found
 */
taskRouter.get(
  "/:id",
  validate({ params: taskIdParamSchema }),
  taskController.getById
);

/**
 * POST /tasks
 * - Create a task for the authenticated user
 */
taskRouter.post(
  "/",
  validate({ body: createTaskSchema }),
  taskController.create
);

/**
 * PUT /tasks/:id
 * - Update task if owned
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
 * DELETE /tasks/:id
 * - Delete task if owned
 */
taskRouter.delete(
  "/:id",
  validate({ params: taskIdParamSchema }),
  taskController.delete
);