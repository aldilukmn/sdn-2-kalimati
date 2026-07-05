import { api } from "@/lib/api";
import type { RegistrationForm, Registrant, PaginatedRegistrants } from "@/types/registration";

export default class RegistrationService {
  static async getAll(page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    return await api<PaginatedRegistrants>(`/registration${qs ? `?${qs}` : ""}`);
  }

  static async create(data: RegistrationForm) {
    return await api<Registrant>("/registration", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getById(id: string) {
    return await api<Registrant>(`/registration/${id}`);
  }

  static async updateData(
    id: string,
    data: Record<string, unknown>
  ) {
    return await api<Registrant>(`/registration/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async totalRegistrations() {
    return await api<{ total: number }>("/registration/count");
  }
}