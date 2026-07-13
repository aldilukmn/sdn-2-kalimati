import { api } from "@/lib/api";
import type { TeacherType } from "@/types/user";

export default class UserService {
  static async getTeachers() {
    return await api<TeacherType[]>("/user?role=guru");
  }

  static async getStaffByRoles(roles: string) {
    return await api<TeacherType[]>(`/user?role=${roles}`);
  }

  static async getTeacherByGrade(grade: string) {
    return await api<TeacherType>(`/teacher-by-grade/${grade}`);
  }

  static async getAll() {
    return await api<TeacherType[]>("/user");
  }

  static async getMe() {
    return await api<TeacherType>("/user/me");
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
    return await api<TeacherType>("/user", {
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
    return await api<TeacherType>(`/user/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async updateProfile(id: string, formData: FormData) {
    return await api<{ user: TeacherType; token: string }>(`/user/${id}/profile`, {
      method: "PATCH",
      body: formData,
    });
  }

  static async delete(id: string) {
    return await api<void>(`/user/${id}`, {
      method: "DELETE",
    });
  }

  static async setSavingsHolder(id: string, savingsHolder: boolean) {
    return await api<void>(`/user/${id}/savings-holder`, {
      method: "PATCH",
      body: JSON.stringify({ savingsHolder }),
    });
  }

  static async setTreasurer(id: string, treasurer: boolean) {
    return await api<void>(`/user/${id}/treasurer`, {
      method: "PATCH",
      body: JSON.stringify({ treasurer }),
    });
  }
}
