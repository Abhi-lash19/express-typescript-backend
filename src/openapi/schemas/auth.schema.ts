// src/openapi/schemas/auth.schema.ts

import { OpenAPIV3_1 } from "openapi-types";

export const AuthRequestSchema: OpenAPIV3_1.SchemaObject = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 10 },
  },
  required: ["email", "password"],
};

export const TokenResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    token: { type: "string" },
    user: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string", format: "email" },
      },
    },
  },
  required: ["success", "token", "user"],
};
