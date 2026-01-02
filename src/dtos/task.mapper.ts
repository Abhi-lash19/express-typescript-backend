// src/dtos/task.mapper.ts

import { Task } from "../repositories/task.repository";
import { TaskResponseDTO } from "./task.dto";

export function toTaskResponseDTO(task: Task): TaskResponseDTO {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
  };
}

export function toTaskListResponseDTO(tasks: Task[]): TaskResponseDTO[] {
  return tasks.map(toTaskResponseDTO);
}
