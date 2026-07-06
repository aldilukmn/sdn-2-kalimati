import { api } from "@/lib/api";
import type { DashboardSummary, TeacherDashboardSummary, AttendanceTrendItem } from "@/types/dashboard";

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

  static async getAttendanceTrend(year?: number, grade?: string) {
    const params = new URLSearchParams();
    if (year) params.set("year", String(year));
    if (grade) params.set("grade", grade);
    const query = params.toString();
    return await api<AttendanceTrendItem[]>(`/dashboard/attendance-trend${query ? `?${query}` : ""}`);
  }
}
