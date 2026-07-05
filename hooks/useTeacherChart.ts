"use client";

import { useEffect, useState } from "react";
import StudentAttendanceService from "@/services/student-attendance.service";
import { mergeAttendance, type AttendanceRow } from "@/lib/merge-attendance";

export function useTeacherChart(
  grade: string,
  month: number,
  year: number,
  initialData?: AttendanceRow[],
  initialHasAttendance?: boolean,
  initialMonth?: number,
  initialYear?: number
) {
  const [data, setData] = useState<AttendanceRow[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [hasAttendanceData, setHasAttendanceData] = useState(
    initialHasAttendance || false
  );

  useEffect(() => {
    if (!grade) {
      setLoading(false);
      setData([]);
      setHasAttendanceData(false);
      return;
    }

    if (initialData && month === initialMonth && year === initialYear) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      setLoading(true);
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          StudentAttendanceService.getStudentsByGrade(grade),
          StudentAttendanceService.getReportByGrade(grade, month, year),
        ]);
        const students = studentsRes.result || studentsRes.data || [];
        const attendance = attendanceRes.result || attendanceRes.data || [];

        const { data: merged, hasData } = mergeAttendance(students, attendance);

        if (!signal.aborted) {
          setData(merged);
          setHasAttendanceData(hasData);
        }
      } catch {
        if (!signal.aborted) {
          setData([]);
          setHasAttendanceData(false);
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [grade, month, year]);

  return { data, loading, hasAttendanceData };
}
