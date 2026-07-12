"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardService from "@/services/dashboard.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import { GRADES } from "@/lib/constants";
import type { DashboardSummary as DashboardSummaryType, TeacherDashboardSummary } from "@/types/dashboard";

export interface DashboardSummary {
  totalRegistrants: number;
  validated: number;
  unvalidated: number;
  totalStudents: number;
  totalTeachers: number;
  gradeCount: number;
  attendanceByStatus: {
    hadir: number;
    sakit: number;
    izin: number;
    absen: number;
  } | null;
  attendanceByGrade:
    | { grade: string; rate: number; studentCount: number }[]
    | null;
  totalDays: number;
}

export interface TeacherSummary {
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
}

export function useDashboard(initialSummary?: DashboardSummary | null, initialMonth?: number, initialYear?: number) {
  const router = useRouter();
  const defaultMonth = initialMonth ?? new Date().getMonth() + 1;
  const defaultYear = initialYear ?? new Date().getFullYear();
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [loading, setLoading] = useState(!initialSummary);
  const [chartLoading, setChartLoading] = useState(!initialSummary);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(initialSummary ?? null);

  const [attendanceDelta, setAttendanceDelta] = useState<number | null>(null);

  const fetchData = async (m: number, y: number, isInitial = false) => {
    try {
      const [dashboardRes, countRes, prevRes] = await Promise.all([
        DashboardService.getSummary(m, y),
        StudentAttendanceService.getStudentCountByGrade(),
        m === 1
          ? DashboardService.getSummary(12, y - 1)
          : DashboardService.getSummary(m - 1, y),
      ]);
      const data = (dashboardRes.result || {}) as DashboardSummaryType;
      const prevData = (prevRes.result || {}) as DashboardSummaryType | null;
      const counts: Record<string, number> = countRes?.result || {};
      setSummary({
        totalRegistrants: data.totalRegistrants ?? 0,
        validated: data.validated ?? 0,
        unvalidated: data.unvalidated ?? 0,
        totalStudents: data.totalStudents ?? 0,
        totalTeachers: data.totalTeachers ?? 0,
        gradeCount: Object.keys(counts).length,
        attendanceByStatus: data.attendanceByStatus || null,
        attendanceByGrade: data.attendanceByGrade || null,
        totalDays: data.totalDays ?? 0,
      });

      const cur = data.attendanceByStatus;
      const prev = prevData?.attendanceByStatus;
      if (cur && prev) {
        const curTotal = cur.hadir + cur.sakit + cur.izin + cur.absen;
        const prevTotal = prev.hadir + prev.sakit + prev.izin + prev.absen;
        const curRate = curTotal > 0 ? (cur.hadir / curTotal) * 100 : 0;
        const prevRate = prevTotal > 0 ? (prev.hadir / prevTotal) * 100 : 0;
        setAttendanceDelta(Math.round((curRate - prevRate) * 100) / 100);
      } else {
        setAttendanceDelta(null);
      }
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 401) {
        router.replace("/login");
        return;
      }
      setError(error.message || "Gagal memuat data dashboard");
    } finally {
      if (isInitial) setLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    if (initialSummary && month === defaultMonth && year === defaultYear) {
      // Grade count still needed even with initial data
      StudentAttendanceService.getStudentCountByGrade()
        .then((res) => {
          const counts: Record<string, number> = res?.result || {};
          setSummary((prev) => prev ? { ...prev, gradeCount: Object.keys(counts).length } : prev);
        })
        .catch((e) => console.error("Gagal fetch student count:", e));
      setChartLoading(false);
      return;
    }
    const isInitial = summary === null;
    if (isInitial) setLoading(true);
    setChartLoading(true);
    setError(null);
    fetchData(month, year, isInitial);
  }, [month, year]);

  const donutData = summary?.attendanceByStatus
    ? [
        {
          name: "hadir",
          value: summary.attendanceByStatus.hadir,
          color: "#10b981",
        },
        {
          name: "sakit",
          value: summary.attendanceByStatus.sakit,
          color: "#f59e0b",
        },
        {
          name: "izin",
          value: summary.attendanceByStatus.izin,
          color: "#3b82f6",
        },
        {
          name: "absen",
          value: summary.attendanceByStatus.absen,
          color: "#ef4444",
        },
      ]
    : [];

  return {
    month,
    setMonth,
    year,
    setYear,
    loading,
    chartLoading,
    error,
    summary,
    donutData,
    attendanceDelta,
  };
}

export function useTeacherDashboard(initialSummary?: TeacherSummary | null) {
  const [loading, setLoading] = useState(!initialSummary);
  const [summary, setSummary] = useState<TeacherSummary | null>(initialSummary ?? null);

  useEffect(() => {
    if (initialSummary) return;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await DashboardService.getTeacherSummary();
        if (controller.signal.aborted) return;
        const data = (res.result || {}) as TeacherDashboardSummary;
        setSummary({
          totalStudents: data.totalStudents ?? 0,
          maleCount: data.maleCount ?? 0,
          femaleCount: data.femaleCount ?? 0,
        });
      } catch {
        if (controller.signal.aborted) return;
      } finally {
        if (controller.signal.aborted) return;
        setLoading(false);
      }
    };
    fetchData();

    return () => controller.abort();
  }, [initialSummary]);

  return { loading, summary };
}
