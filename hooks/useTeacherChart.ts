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

    // Skip initial fetch if data matches server-preloaded month/year
    if (
      initialData &&
      month === initialMonth &&
      year === initialYear
    ) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          StudentAttendanceService.getStudentsByGrade(grade),
          StudentAttendanceService.getReportByGrade(grade, month, year),
        ]);
        const students = studentsRes.result || studentsRes.data || [];
        const attendance = attendanceRes.result || attendanceRes.data || [];

        const { data: merged, hasData } = mergeAttendance(students, attendance);

        if (!cancelled) {
          setData(merged);
          setHasAttendanceData(hasData);
        }
      } catch {
        if (!cancelled) {
          setData([]);
          setHasAttendanceData(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [grade, month, year]);

  return { data, loading, hasAttendanceData };
}
