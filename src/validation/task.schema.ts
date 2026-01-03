// src/validation/task.schema.ts

import { z } from "zod";

export const taskIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Task ID must be a number"),
});

export const taskQuerySchema = z
  .object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  })
  .passthrough();

  
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  completed: z.coerce.boolean().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
