import { api } from "@/lib/api";
import type { Score, BulkScoreRequest } from "@/types/nilai-harian";

export default class ScoreService {
  static async getAll(chapterId: string, materialId?: string) {
    let url = `/scores?chapterId=${chapterId}`;
    if (materialId) url += `&materialId=${materialId}`;
    return await api<Score[]>(url);
  }

  static async bulkCreate(data: BulkScoreRequest) {
    return await api<Score[]>("/scores/bulk", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, score: number, maxScore?: number) {
    return await api<Score>(`/scores/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ score, maxScore }),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/scores/${id}`, {
      method: "DELETE",
    });
  }
}
