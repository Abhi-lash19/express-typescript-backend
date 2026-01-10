// src/openapi/schemas/error.schema.ts

import { OpenAPIV3_1 } from "openapi-types";

export const ErrorSchema: OpenAPIV3_1.SchemaObject = {
  type: "object",
  properties: {
    success: { type: "boolean", example: false },
    error: {
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "integer" },
      },
      required: ["message", "code"],
    },
  },
};

