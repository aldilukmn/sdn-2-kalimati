import { api } from "@/lib/api";
import type { GradeSubject, GradeSubjectCreateRequest, GradeSubjectUpdateRequest, GradeSubjectQueryParams } from "@/types/nilai-harian";

export default class GradeSubjectService {
  static async getAll(params?: GradeSubjectQueryParams) {
    const searchParams = new URLSearchParams();
    if (params?.grade) searchParams.set("grade", params.grade);
    if (params?.semester) searchParams.set("semester", params.semester);
    if (params?.academicYear) searchParams.set("academicYear", params.academicYear);
    const qs = searchParams.toString();
    const url = qs ? `/grade-subjects?${qs}` : "/grade-subjects";
    return await api<GradeSubject[]>(url);
  }

  static async create(data: GradeSubjectCreateRequest) {
    return await api<GradeSubject>("/grade-subjects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: GradeSubjectUpdateRequest) {
    return await api<GradeSubject>(`/grade-subjects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/grade-subjects/${id}`, {
      method: "DELETE",
    });
  }
}
