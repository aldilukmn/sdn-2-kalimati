import { api } from "@/lib/api";
import type { CharacterAssessment, AssessmentListItem, AssessmentCreateRequest, AssessmentUpdateRequest } from "@/types/character-assessment";

export default class CharacterAssessmentService {
  static async getAll(params: { grade: string; academicYear: string; semester: string; month?: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set("grade", params.grade);
    searchParams.set("academicYear", params.academicYear);
    searchParams.set("semester", params.semester);
    if (params.month) searchParams.set("month", params.month);
    return await api<AssessmentListItem[]>(`/character-assessment?${searchParams.toString()}`);
  }

  static async getById(id: string) {
    return await api<CharacterAssessment>(`/character-assessment/${id}`);
  }

  static async create(data: AssessmentCreateRequest) {
    return await api<CharacterAssessment>("/character-assessment", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: AssessmentUpdateRequest) {
    return await api<CharacterAssessment>(`/character-assessment/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/character-assessment/${id}`, {
      method: "DELETE",
    });
  }
}
