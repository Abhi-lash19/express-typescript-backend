// src/repositories/task.repository.ts

import { supabase } from "../config/supabase";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const taskRepository = {
  async findAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return data as Task[];
  },

  async findBySearch(search: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed")
      .ilike("title", `%${search}%`)
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return data as Task[];
  },

  async findById(id: number): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return undefined; // not found
      }
      throw error;
    }

    return data as Task;
  },

  async create(task: Omit<Task, "id">): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: task.title,
        completed: task.completed,
      })
      .select("id, title, completed")
      .single();

    if (error) {
      throw error;
    }

    return data as Task;
  },

  async update(
    id: number,
    update: Omit<Task, "id">
  ): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: update.title,
        completed: update.completed,
      })
      .eq("id", id)
      .select("id, title, completed")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return undefined;
      }
      throw error;
    }

    return data as Task;
  },

  async delete(id: number): Promise<boolean> {
    const { error, count } = await supabase
      .from("tasks")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      throw error;
    }

    return Boolean(count && count > 0);
  },
};
