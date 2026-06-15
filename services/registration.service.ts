import { api } from "@/lib/api";

export default class RegistrationService {
  static async getAll() {
    return await api("/registration");
  }
  
  static async create(data: RegistrationForm) {
    return await api("/registration", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getById(id: string) {
    return await api(`/registration/${id}`);
  }

  static async updateValidation(
    id: string,
    status: "validated" | "unvalidated"
  ) {
    return await api(`/registration/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  static async totalRegistrations() {
    return await api("/registration/count");
  }
}