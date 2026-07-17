import { api } from "@/lib/api";
import type { LitnumTask, LitnumScore, BulkLitnumScoreRequest } from "@/types/litnum";

export class LitnumTaskService {
  static async getAll(params: { academicYear: string; semester: string; grade: string }) {
    const searchParams = new URLSearchParams(params);
    return await api<LitnumTask[]>(`/litnums?${searchParams.toString()}`);
  }

  static async create(data: { academicYear: string; semester: string; grade: string; name: string }) {
    return await api<LitnumTask>("/litnums", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: { name: string }) {
    return await api<LitnumTask>(`/litnums/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/litnums/${id}`, { method: "DELETE" });
  }
}

export class LitnumScoreService {
  static async getAll(litnumId: string) {
    const params = new URLSearchParams({ litnumId });
    return await api<LitnumScore[]>(`/litnum-scores?${params.toString()}`);
  }

  static async bulkCreate(data: BulkLitnumScoreRequest) {
    return await api<LitnumScore[]>("/litnum-scores/bulk", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: { score: number }) {
    return await api<LitnumScore>(`/litnum-scores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/litnum-scores/${id}`, { method: "DELETE" });
  }
}
