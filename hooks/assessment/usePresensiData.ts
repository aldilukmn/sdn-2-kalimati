import { useEffect, useState } from "react";
import StudentAttendanceService from "@/services/student-attendance.service";
import type { KarakterStudent } from "./useKarakterData";

export function usePresensiData(
  selectedComponentKey: string,
  role: string | null,
  grade: string,
  semester: string,
  academicYear: string,
  students: { studentId: string; name: string }[],
  retryCount: number,
  safeKey: (key: string) => string
) {
  const [presensiStudents, setPresensiStudents] = useState<KarakterStudent[]>([]);
  const [presensiLoading, setPresensiLoading] = useState(false);

  useEffect(() => {
    if (safeKey(selectedComponentKey) !== "presensi") return;
    if (!role || !grade || !semester || !academicYear) return;
    if (students.length === 0) return;

    let cancelled = false;
    setPresensiLoading(true);
    setPresensiStudents([]);

    const months = semester === "1" ? [7, 8, 9, 10, 11, 12] : [1, 2, 3, 4, 5, 6];
    const year = parseInt(academicYear.split("/")[0], 10);

    (async () => {
      try {
        const reports = await Promise.all(
          months.map((m) =>
            StudentAttendanceService.getReportByGrade(grade, m, year)
              .then((res) => ({ month: m, data: res?.result || [] }))
              .catch(() => ({ month: m, data: [] as import("@/types/attendance").AttendanceReportItem[] }))
          )
        );

        if (cancelled) return;

        // Group by student: studentId -> month -> { hadir, sakit, izin, absen }
        const studentMonthly = new Map<string, Map<number, { hadir: number; sakit: number; izin: number; absen: number }>>();
        for (const report of reports) {
          for (const row of report.data) {
            if (!studentMonthly.has(row.studentId)) {
              studentMonthly.set(row.studentId, new Map());
            }
            studentMonthly.get(row.studentId)!.set(report.month, {
              hadir: row.hadir ?? 0,
              sakit: row.sakit ?? 0,
              izin: row.izin ?? 0,
              absen: row.absen ?? 0,
            });
          }
        }

        const merged: KarakterStudent[] = students.map((s) => {
          const monthlyData = studentMonthly.get(s.studentId);
          if (!monthlyData || monthlyData.size === 0) {
            return { studentId: s.studentId, name: s.name, avg: null };
          }

          let totalScore = 0;
          let monthCount = 0;

          for (const m of months) {
            const data = monthlyData.get(m);
            if (!data) continue;

            const totalDays = data.hadir + data.sakit + data.izin + data.absen;
            if (totalDays === 0) continue;

            const monthlyScore = ((data.hadir + 0.5 * data.sakit + 0.5 * data.izin) / totalDays) * 100;
            totalScore += monthlyScore;
            monthCount++;
          }

          const avg = monthCount > 0 ? Math.round((totalScore / monthCount) * 100) / 100 : null;
          return { studentId: s.studentId, name: s.name, avg };
        });

        merged.sort((a, b) => a.name.localeCompare(b.name, "id"));
        if (!cancelled) setPresensiStudents(merged);
      } catch {
        if (!cancelled) setPresensiStudents([]);
      } finally {
        if (!cancelled) setPresensiLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedComponentKey, role, grade, semester, academicYear, retryCount, students, safeKey]);

  return { presensiStudents, presensiLoading };
}
