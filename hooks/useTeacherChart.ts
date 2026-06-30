"use client";

import { useEffect, useState } from "react";
import StudentAttendanceService from "@/services/student-attendance.service";

interface StudentRow {
  _id: string;
  studentIndex: number;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
}

export function useTeacherChart(grade: string, month: number, year: number) {
  const [data, setData] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAttendanceData, setHasAttendanceData] = useState(false);

  useEffect(() => {
    if (!grade) { setLoading(false); setData([]); setHasAttendanceData(false); return; }
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
        const attendanceMap = new Map<string, any>();
        for (const a of attendance) {
          const key = a.studentId || a._id;
          if (!attendanceMap.has(key)) {
            attendanceMap.set(key, { hadir: 0, sakit: 0, izin: 0, alpha: 0 });
          }
          const r = attendanceMap.get(key)!;
          if (a.status) {
            if (a.status === "hadir") r.hadir++;
            else if (a.status === "sakit") r.sakit++;
            else if (a.status === "izin") r.izin++;
            else if (a.status === "alpha") r.alpha++;
          } else {
            r.hadir += a.hadir ?? 0;
            r.sakit += a.sakit ?? 0;
            r.izin += a.izin ?? 0;
            r.alpha += a.alpha ?? 0;
          }
        }
        const merged = students.map((s: any, idx: number) => {
          const a = attendanceMap.get(s.studentId);
          return {
            _id: s.studentId,
            studentIndex: idx,
            name: s.name,
            hadir: a?.hadir ?? 0,
            sakit: a?.sakit ?? 0,
            izin: a?.izin ?? 0,
            alpha: a?.alpha ?? 0,
          };
        });
        const hasData = merged.some((m: StudentRow) => m.hadir > 0 || m.sakit > 0 || m.izin > 0 || m.alpha > 0);
        if (!cancelled) { setData(merged); setHasAttendanceData(hasData); }
      } catch {
        if (!cancelled) { setData([]); setHasAttendanceData(false); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [grade, month, year]);

  return { data, loading, hasAttendanceData };
}
