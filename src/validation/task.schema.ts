// src/validation/task.schema.ts

import { z } from "zod";

export const taskIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Task ID must be a number"),
});

export const taskQuerySchema = z.object({
  search: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
