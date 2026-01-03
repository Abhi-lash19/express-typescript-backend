// src/repositories/task.repository.ts

import { supabase } from "../config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const taskRepository = {
  async findAll(
    supabase: SupabaseClient,
    userId: string,
    offset = 0,
    limit = 10
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed")
      .eq("user_id", userId)
      .order("id", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data as Task[];
  },

  async findBySearch(
    supabase: SupabaseClient,
    userId: string,
    search: string,
    offset = 0,
    limit = 10
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed")
      .eq("user_id", userId)
      .ilike("title", `%${search}%`)
      .order("id", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data as Task[];
  },

  async findById(supabase: SupabaseClient, userId: string, id: number): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error?.code === "PGRST116") return undefined;
    if (error) throw error;

    return data as Task;
  },

  async create(
    supabase: SupabaseClient,
    userId: string,
    task: Omit<Task, "id">
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: task.title,
        completed: task.completed,
        user_id: userId,
      })
      .select("id, title, completed")
      .single();

    if (error) throw error;
    return data as Task;
  },

  async update(
    supabase: SupabaseClient,
    userId: string,
    id: number,
    update: Omit<Task, "id">
  ): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from("tasks")
      .update(update)
      .eq("id", id)
      .eq("user_id", userId)
      .select("id, title, completed")
      .single();

    if (error?.code === "PGRST116") return undefined;
    if (error) throw error;

    return data as Task;
  },

  async delete(supabase: SupabaseClient, userId: string, id: number): Promise<boolean> {
    const { count, error } = await supabase
      .from("tasks")
      .delete({ count: "exact" })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return Boolean(count && count > 0);
  },
};
