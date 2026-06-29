import { api } from "@/lib/api";

export default class DashboardService {
  static async getSummary(month?: number, year?: number) {
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    if (year) params.set("year", String(year));
    const query = params.toString();
    return await api(`/dashboard${query ? `?${query}` : ""}`);
  }

  static async getTeacherSummary() {
    return await api("/dashboard/teacher");
  }
}
