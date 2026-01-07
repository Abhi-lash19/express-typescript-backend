// src/internal/apiMeta.ts

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type BodyType = "none" | "json" | "form";

export interface ApiParamMeta {
  name: string;
  in: "path" | "query";
  required: boolean;
  example?: string | number;
}

export interface ApiEndpointMeta {
  method: HttpMethod;
  path: string;                 // e.g. /tasks/{id}
  description: string;
  authRequired: boolean;

  // NEW — frontend guidance
  params?: ApiParamMeta[];
  supportsPagination?: boolean;
  supportsSearch?: boolean;

  requestBody?: {
    type: BodyType;
    example?: unknown;
  };

  responseExample?: unknown;
}

export const apiMeta: ApiEndpointMeta[] = [
  {
    method: "GET",
    path: "/tasks",
    description: "List tasks with optional pagination and search",
    authRequired: true,
    supportsPagination: true,
    supportsSearch: true,
    params: [
      { name: "page", in: "query", required: false, example: 1 },
      { name: "limit", in: "query", required: false, example: 10 }
    ],
    responseExample: {
      success: true,
      data: [{ id: 1, title: "Task 1", completed: false }],
      meta: { page: 1, limit: 10 }
    }
  },
  {
    method: "GET",
    path: "/tasks/{id}",
    description: "Get task by ID",
    authRequired: true,
    params: [
      { name: "id", in: "path", required: true, example: "1" }
    ],
    responseExample: {
      success: true,
      data: { id: 1, title: "Task 1", completed: false }
    }
  },
  {
    method: "POST",
    path: "/tasks",
    description: "Create a new task",
    authRequired: true,
    requestBody: {
      type: "json",
      example: { title: "New task", completed: false }
    }
  },
  {
    method: "PUT",
    path: "/tasks/{id}",
    description: "Update an existing task",
    authRequired: true,
    params: [
      { name: "id", in: "path", required: true, example: "1" }
    ],
    requestBody: {
      type: "json",
      example: { title: "Updated task", completed: true }
    }
  },
  {
    method: "DELETE",
    path: "/tasks/{id}",
    description: "Delete a task",
    authRequired: true,
    params: [
      { name: "id", in: "path", required: true, example: "1" }
    ]
  }
];
