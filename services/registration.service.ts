import { api } from "@/lib/api";

export default class RegistrationService {
  static async getAll() {
    return await api("/registration");
  }

  static async create(data: any) {
    return await api("/registration", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getById(id: string) {
    return await api(`/registration/${id}`);
  }
}