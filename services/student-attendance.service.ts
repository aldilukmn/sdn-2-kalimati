import { api } from "@/lib/api";

export default class StudentAttendanceService {
  static async create(data: StudentAttendanceRequestType) {
    return await api("/student-attendance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getByGradeAndDate(grade: string, date: string) {
    return await api(`/student-attendance?grade=${grade}&date=${date}`);
  }

  static async getReportByGrade(grade: string, month?: number, year?: number) {
    const params = new URLSearchParams();
    params.set("grade", grade);
    if (month) params.set("month", String(month));
    if (year) params.set("year", String(year));
    return await api(`/student-attendance/report?${params.toString()}`);
  }

  static async getStudentsByGrade(grade: string) {
    return await api(`/students?grade=${grade}`);
  }

  static async getStudentCountByGrade() {
    return await api(`/students/count-by-grade`);
  }
}
