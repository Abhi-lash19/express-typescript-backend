// src/openapi/paths/auth.paths.ts

import { OpenAPIV3 } from "openapi-types";

export const authPaths: OpenAPIV3.PathsObject = {
  "/auth/signup": {
    post: {
      tags: ["Auth"],
      summary: "Create a new user account",
      description:
        "Creates a new user in Supabase Auth. Email does not need to be real, password must be strong.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AuthRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                  userId: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        "400": {
          description: "Validation error or signup failure",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        "429": {
          description: "Too many requests",
        },
      },
    },
  },

  "/auth/token": {
    post: {
      tags: ["Auth"],
      summary: "Generate JWT token",
      description:
        "Authenticates a user using email and password and returns a Supabase-issued JWT.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AuthRequest" },
          },
        },
      },
      responses: {
        "200": {
          description: "JWT token generated",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TokenResponse" },
            },
          },
        },
        "401": {
          description: "Invalid credentials",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        "400": {
          description: "Missing email or password",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        "429": {
          description: "Too many requests",
        },
      },
    },
  },
};
