import { api } from "@/lib/api";
import type { Subject, SubjectCreateRequest, SubjectUpdateRequest } from "@/types/nilai-harian";

export default class SubjectService {
  static async getAll() {
    return await api<Subject[]>("/subjects");
  }

  static async create(data: SubjectCreateRequest) {
    return await api<Subject>("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: SubjectUpdateRequest) {
    return await api<Subject>(`/subjects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/subjects/${id}`, {
      method: "DELETE",
    });
  }
}
