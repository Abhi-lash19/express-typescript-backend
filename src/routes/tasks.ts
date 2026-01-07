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
 * ACCESS MODEL (IMPORTANT)
 *
 * - All routes require authentication
 * - Any authenticated user may READ tasks
 * - Only task owners may CREATE / UPDATE / DELETE
 *
 * Ownership failures are intentionally surfaced as 404
 * to avoid leaking resource existence.
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