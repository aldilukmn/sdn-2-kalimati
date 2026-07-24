import { api } from "@/lib/api";
import type { Note, NoteCreateRequest, NoteUpdateRequest } from "@/types/note";

export default class NoteService {
  static async getAll(gradeSubjectId: string, month?: number, year?: number) {
    const params = new URLSearchParams();
    params.append("gradeSubjectId", gradeSubjectId);
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    return await api<Note[]>(`/notes?${params.toString()}`);
  }

  static async create(data: NoteCreateRequest) {
    return await api<Note>("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: NoteUpdateRequest) {
    return await api<Note>(`/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/notes/${id}`, {
      method: "DELETE",
    });
  }
}
