import { cookies } from "next/headers";
import { apiServer } from "@/lib/api-server";
import { mergeAttendance, type AttendanceRow } from "@/lib/merge-attendance";
import type { DashboardSummary, TeacherSummary } from "@/hooks/useDashboard";
import DashboardClient from "./client";

function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

async function fetchTeacherChart(
  token: string,
  grade: string,
  month: number,
  year: number
): Promise<{ data: AttendanceRow[]; hasData: boolean }> {
  try {
    const [studentsRes, attendanceRes] = await Promise.all([
      apiServer<any>(`/students?grade=${grade}`, token),
      apiServer<any>(`/student-attendance/report?grade=${grade}&month=${month}&year=${year}`, token),
    ]);
    const students = studentsRes.result || studentsRes.data || [];
    const attendance = attendanceRes.result || attendanceRes.data || [];

    return mergeAttendance(students, attendance);
  } catch {
    return { data: [], hasData: false };
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_session")?.value;

  let userRole: string | null = null;
  let userName: string | null = null;
  let userGrade: string | null = null;

  if (token) {
    const payload = decodeJWT(token);
    if (payload) {
      userRole = payload.role || null;
      userName = payload.fullName || null;
      userGrade = payload.grade || null;
    }
  }

  const initialMonth = new Date().getMonth() + 1;
  const initialYear = new Date().getFullYear();

  let guruSummary: TeacherSummary | null = null;
  let guruChartData: AttendanceRow[] = [];
  let guruHasAttendance = false;
  let adminSummary: DashboardSummary | null = null;

  if (userRole === "guru" && userGrade && token) {
    const month = initialMonth;
    const year = initialYear;

    try {
      const summaryRes = await apiServer<any>("/dashboard/teacher", token);
      const data = summaryRes.result || summaryRes.data || {};
      guruSummary = {
        totalStudents: data.totalStudents ?? 0,
        maleCount: data.maleCount ?? 0,
        femaleCount: data.femaleCount ?? 0,
      };
    } catch {
      guruSummary = null;
    }

    const chartResult = await fetchTeacherChart(token, userGrade, month, year);
    guruChartData = chartResult.data;
    guruHasAttendance = chartResult.hasData;
  }

  if ((userRole === "admin" || userRole === "kepala") && token) {
    try {
      const res = await apiServer<any>(`/dashboard?month=${initialMonth}&year=${initialYear}`, token);
      const data = res.result || res.data || {};
      adminSummary = {
        totalRegistrants: data.totalRegistrants ?? 0,
        validated: data.validated ?? 0,
        unvalidated: data.unvalidated ?? 0,
        totalStudents: data.totalStudents ?? 0,
        totalTeachers: data.totalTeachers ?? 0,
        attendanceByStatus: data.attendanceByStatus || null,
        attendanceByGrade: data.attendanceByGrade || null,
        totalDays: data.totalDays ?? 0,
      };
    } catch {
      adminSummary = null;
    }
  }

  return (
    <DashboardClient
      userRole={userRole}
      userName={userName}
      userGrade={userGrade}
      initialMonth={initialMonth}
      initialYear={initialYear}
      guruInitialSummary={guruSummary}
      guruInitialChartData={guruChartData}
      guruInitialHasAttendance={guruHasAttendance}
      adminInitialSummary={adminSummary}
    />
  );
}
