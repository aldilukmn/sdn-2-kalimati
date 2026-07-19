import { api } from "@/lib/api";
import { MasterStudentType } from "@/types/attendance";

export class MasterStudentService {
  static async getByGrade(grade: string) {
    return await api<MasterStudentType[]>(`/students?grade=${grade}`);
  }

  static async create(data: Partial<MasterStudentType>) {
    return await api<MasterStudentType>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: Partial<MasterStudentType>) {
    return await api<MasterStudentType>(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api(`/students/${id}`, {
      method: "DELETE",
    });
  }

  static async importData(students: Partial<MasterStudentType>[]) {
    return await api("/students/import", {
      method: "POST",
      body: JSON.stringify({ students }),
    });
  }
}
