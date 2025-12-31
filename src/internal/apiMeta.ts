//src/internal/apiMeta.ts

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiEndpointMeta {
  method: HttpMethod;
  path: string;
  description: string;
  authRequired: boolean;
  sampleRequest?: unknown;
  sampleResponse?: unknown;
}

export const apiMeta: ApiEndpointMeta[] = [
  {
    method: "GET",
    path: "/tasks",
    description: "Get all tasks or search tasks",
    authRequired: false,
    sampleResponse: {
      tasks: [{ id: 1, title: "Task 1", completed: false }]
    }
  },
  {
    method: "GET",
    path: "/tasks/:id",
    description: "Get task by ID",
    authRequired: false,
    sampleResponse: {
      task: { id: "1", title: "Task 1", completed: false }
    }
  },
  {
    method: "POST",
    path: "/tasks",
    description: "Create a new task",
    authRequired: true,
    sampleRequest: {
      title: "New task",
      completed: false
    }
  },
  {
    method: "PUT",
    path: "/tasks/:id",
    description: "Update an existing task",
    authRequired: true
  },
  {
    method: "DELETE",
    path: "/tasks/:id",
    description: "Delete a task",
    authRequired: true
  }
];
