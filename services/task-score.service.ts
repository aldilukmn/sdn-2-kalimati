import { api } from "@/lib/api";
import type { TaskScore, BulkTaskScoreRequest } from "@/types/tugas";

export default class TaskScoreService {
  static async getAll(taskId: string) {
    const params = new URLSearchParams({ taskId });
    return await api<TaskScore[]>(`/task-scores?${params.toString()}`);
  }

  static async bulkCreate(data: BulkTaskScoreRequest) {
    return await api<TaskScore[]>("/task-scores/bulk", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: { score: number }) {
    return await api<TaskScore>(`/task-scores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/task-scores/${id}`, { method: "DELETE" });
  }
}
