import { api } from "@/lib/api";
import type { DashboardSummary, TeacherDashboardSummary } from "@/types/dashboard";

export default class DashboardService {
  static async getSummary(month?: number, year?: number) {
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    if (year) params.set("year", String(year));
    const query = params.toString();
    return await api<DashboardSummary>(`/dashboard${query ? `?${query}` : ""}`);
  }

  static async getTeacherSummary() {
    return await api<TeacherDashboardSummary>("/dashboard/teacher");
  }
}
