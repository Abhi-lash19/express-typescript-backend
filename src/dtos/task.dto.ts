// src/dtos/task.dto.ts

/**
 * Incoming DTOs (what API accepts)
 */
export interface CreateTaskDTO {
  title: string;
  completed?: boolean;
}

export interface UpdateTaskDTO {
  title?: string;
  completed?: boolean;
}

/**
 * Outgoing DTO (what API returns)
 */
export interface TaskResponseDTO {
  id: number;
  title: string;
  completed: boolean;
}
