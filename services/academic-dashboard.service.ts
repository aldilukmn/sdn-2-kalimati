import { api } from "@/lib/api";

export interface ComponentStat {
  items: number;
  avgScore: number;
  filled: number;
  possible: number;
}

export interface StudentStat {
  studentId: string;
  studentName: string;
  completed: number;
  total: number;
  completionRate: number;
  averageScore: number;
}

export interface AcademicSummaryResponse {
  summary: {
    totalStudents: number;
    totalAssessments: number;
    averageScore: number;
    totalFilled: number;
    totalPossible: number;
    byComponent: {
      harian: ComponentStat;
      tugas: ComponentStat;
      keaktifan: ComponentStat;
      partisipasi: ComponentStat;
      litnum: ComponentStat;
    };
    recentActivities?: {
      id: string;
      title: string;
      category: string;
      date: string;
      subject: string;
    }[];
  };
  students: StudentStat[];
}

export default class AcademicDashboardService {
  static async getAcademicSummary(grade: string, semester: string, academicYear: string) {
    const params = new URLSearchParams();
    params.set("grade", grade);
    params.set("semester", semester);
    params.set("academicYear", academicYear);
    return await api<AcademicSummaryResponse>(`/dashboard/academic-summary?${params.toString()}`);
  }
}
