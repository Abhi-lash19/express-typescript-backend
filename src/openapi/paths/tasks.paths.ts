// src/openapi/paths/tasks.paths.ts

import { OpenAPIV3 } from "openapi-types";

export const tasksPaths: OpenAPIV3.PathsObject = {
  "/api/v1/tasks": {
    get: {
      tags: ["Tasks"],
      summary: "List tasks",
      description:
        "Returns a paginated list of tasks. User must be authenticated. Tasks are scoped to the authenticated user.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "search",
          in: "query",
          schema: { type: "string" },
          description: "Search tasks by title",
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", minimum: 1 },
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", minimum: 1, maximum: 100 },
        },
      ],
      responses: {
        "200": {
          description: "Paginated list of tasks",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "object",
                    properties: {
                      tasks: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Task" },
                      },
                    },
                  },
                  meta: { $ref: "#/components/schemas/PaginationMeta" },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },

    post: {
      tags: ["Tasks"],
      summary: "Create task",
      description:
        "Creates a new task owned by the authenticated user.",
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", maxLength: 255 },
                completed: { type: "boolean" },
              },
              required: ["title"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Task created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "object",
                    properties: {
                      task: { $ref: "#/components/schemas/Task" },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },
  },

  "/api/v1/tasks/{id}": {
    get: {
      tags: ["Tasks"],
      summary: "Get task by ID",
      description:
        "Returns a single task. Returns 404 if task does not exist or is not owned by the user.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Task found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "object",
                    properties: {
                      task: { $ref: "#/components/schemas/Task" },
                    },
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Task not found or not owned",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },

    put: {
      tags: ["Tasks"],
      summary: "Update task",
      description:
        "Updates a task if owned by the authenticated user. Ownership failures return 404.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", maxLength: 255 },
                completed: { type: "boolean" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Task updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "object",
                    properties: {
                      task: { $ref: "#/components/schemas/Task" },
                    },
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Task not found or not owned",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },

    delete: {
      tags: ["Tasks"],
      summary: "Delete task",
      description:
        "Deletes a task if owned by the authenticated user. Ownership failures return 404.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "Task deleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Task not found or not owned",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },
  },
};
