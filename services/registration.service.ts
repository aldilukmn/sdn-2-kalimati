import { api } from "@/lib/api";

export default class RegistrationService {
  static async getAll() {
    return await api("/registration");
  }

  static async getById(id: string) {
    return await api(`/registration/${id}`);
  }
}