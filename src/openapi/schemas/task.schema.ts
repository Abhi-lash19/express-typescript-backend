// src/openapi/schemas/task.schema.ts

import { OpenAPIV3_1 } from "openapi-types";

export const TaskSchema: OpenAPIV3_1.SchemaObject = {
  type: "object",
  required: ["id", "title", "completed", "user_id", "created_at"],
  properties: {
    id: { type: "integer" },
    title: { type: "string", maxLength: 255 },
    completed: { type: "boolean" },
    user_id: { type: "string", description: "Owner user ID" },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
};

