import { api } from "@/lib/api";
import type { Task } from "@/types/tugas";

export default class TaskService {
  static async getAll(gradeSubjectId: string) {
    const params = new URLSearchParams({ gradeSubjectId });
    return await api<Task[]>(`/tasks?${params.toString()}`);
  }

  static async create(data: { gradeSubjectId: string; name: string }) {
    return await api<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: { name: string }) {
    return await api<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/tasks/${id}`, { method: "DELETE" });
  }
}
