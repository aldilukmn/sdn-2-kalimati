import { api } from "@/lib/api";

export default class DashboardService {
  static async getSummary() {
    return await api("/dashboard");
  }
}
