import { api } from "@/lib/api";
import type { Chapter, ChapterCreateRequest, ChapterUpdateRequest, ReorderItem } from "@/types/nilai-harian";

export default class ChapterService {
  static async getAll(gradeSubjectId: string) {
    return await api<Chapter[]>(`/chapters?gradeSubjectId=${gradeSubjectId}`);
  }

  static async create(data: ChapterCreateRequest) {
    return await api<Chapter>("/chapters", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: ChapterUpdateRequest) {
    return await api<Chapter>(`/chapters/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async reorder(gradeSubjectId: string, items: ReorderItem[]) {
    return await api<void>("/chapters/reorder", {
      method: "PUT",
      body: JSON.stringify({ gradeSubjectId, items }),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/chapters/${id}`, {
      method: "DELETE",
    });
  }
}
