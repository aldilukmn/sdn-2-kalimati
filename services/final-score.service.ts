import { api } from "@/lib/api";
import type { ComponentScoreDto, FinalScoreEntry, CalculateResponse } from "@/types/final-score";

export default class FinalScoreService {
  static async getAll(params: { grade: string; subjectId?: string; semester: string; academicYear: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set("grade", params.grade);
    if (params.subjectId) searchParams.set("subjectId", params.subjectId);
    searchParams.set("semester", params.semester);
    searchParams.set("academicYear", params.academicYear);
    return await api<FinalScoreEntry[]>(`/final-scores?${searchParams.toString()}`);
  }

  static async calculate(data: { grade: string; subjectId?: string; semester: string; academicYear: string }) {
    return await api<CalculateResponse>("/final-scores/calculate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
