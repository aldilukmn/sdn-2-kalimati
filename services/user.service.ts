import { api } from "@/lib/api";

export default class UserService {
  static async getTeachers(): Promise<UserApiResponse> {
    return await api<UserApiResponse>("/user?role=guru");
  }

  static async getStaffByRoles(roles: string): Promise<UserApiResponse> {
    return await api<UserApiResponse>(`/user?role=${roles}`);
  }

  static async getTeacherByGrade(grade: string) {
    return await api(`/teacher-by-grade/${grade}`);
  }

  static async getAll() {
    return await api("/user");
  }

  static async create(data: {
    username: string;
    password: string;
    role: string;
    grade?: string;
    nip?: string;
    fullName?: string;
    title?: string;
  }) {
    return await api("/user", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(
    id: string,
    data: {
      username?: string;
      grade?: string;
      nip?: string;
      fullName?: string;
      title?: string;
    },
  ) {
    return await api(`/user/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async delete(id: string) {
    return await api(`/user/${id}`, {
      method: "DELETE",
    });
  }
}
