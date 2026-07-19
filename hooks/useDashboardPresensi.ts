"use client";

import { useEffect, useState, useCallback } from "react";
import StudentAttendanceService from "@/services/student-attendance.service";
import DashboardService from "@/services/dashboard.service";
import type { AttendanceReportItem, StudentAttendanceType } from "@/types/attendance";
import { AVAILABLE_YEARS } from "@/lib/constants";
import { getTodayLocal } from "@/lib/format";

export type ViewMode = "bulanan" | "harian";

export interface AttendanceSummary {
  hadir: number;
  sakit: number;
  izin: number;
  absen: number;
  total: number;
  hadirRate: number;
}

export interface StudentAbsenceRow {
  studentId: string;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  absen: number;
  total: number;
  hadirRate: number;
}

export interface GradeAttendanceRow {
  grade: string;
  rate: number;
  studentCount: number;
}

export function useDashboardPresensi(
  userRole: string | null,
  userGrade: string | null
) {
  const now = new Date();

  const [viewMode, setViewMode] = useState<ViewMode>("harian");
  const [grade, setGrade] = useState(userGrade ?? "1");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  const [trendYear, setTrendYear] = useState(now.getFullYear());

  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [studentRows, setStudentRows] = useState<StudentAbsenceRow[]>([]);
  const [gradeRows, setGradeRows] = useState<GradeAttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  // Total siswa di kelas (untuk mode harian — context "X dari Y siswa")
  const [totalStudents, setTotalStudents] = useState<number>(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  // Sync grade for guru role
  useEffect(() => {
    if (userRole === "guru" && userGrade) {
      setGrade(userGrade);
    }
  }, [userRole, userGrade]);

  // ── MODE BULANAN ────────────────────────────────────────────────────────
  useEffect(() => {
    if (viewMode !== "bulanan" || !grade) return;

    let cancelled = false;
    const fetchBulanan = async () => {
      setLoading(true);
      setError(null);
      try {
        const isAdminOrKepala = userRole === "admin" || userRole === "kepala";

        const [reportRes, dashboardRes] = await Promise.all([
          StudentAttendanceService.getReportByGrade(grade, month, year),
          isAdminOrKepala
            ? DashboardService.getSummary(month, year)
            : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const rows: AttendanceReportItem[] = reportRes?.result ?? [];

        const processedRows: StudentAbsenceRow[] = rows.map((r) => {
          const hadir = r.hadir ?? 0;
          const sakit = r.sakit ?? 0;
          const izin = r.izin ?? 0;
          const absen = r.absen ?? 0;
          const total = hadir + sakit + izin + absen;
          return {
            studentId: r._id ?? r.studentId ?? "",
            name: r.name ?? "-",
            hadir,
            sakit,
            izin,
            absen,
            total,
            hadirRate: total > 0 ? Math.round((hadir / total) * 100) : 0,
          };
        });

        setStudentRows(processedRows);
        setTotalStudents(processedRows.length);

        const totalHadir = processedRows.reduce((s, r) => s + r.hadir, 0);
        const totalSakit = processedRows.reduce((s, r) => s + r.sakit, 0);
        const totalIzin = processedRows.reduce((s, r) => s + r.izin, 0);
        const totalAbsen = processedRows.reduce((s, r) => s + r.absen, 0);
        const grandTotal = totalHadir + totalSakit + totalIzin + totalAbsen;

        setSummary({
          hadir: totalHadir,
          sakit: totalSakit,
          izin: totalIzin,
          absen: totalAbsen,
          total: grandTotal,
          hadirRate:
            grandTotal > 0 ? Math.round((totalHadir / grandTotal) * 100) : 0,
        });

        if (dashboardRes) {
          setGradeRows(dashboardRes?.result?.attendanceByGrade ?? []);
        } else {
          setGradeRows([]);
        }
      } catch {
        if (!cancelled) {
          setError("Gagal memuat data dashboard presensi.");
          setSummary(null);
          setStudentRows([]);
          setGradeRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    };

    fetchBulanan();
    return () => { cancelled = true; };
  }, [viewMode, grade, month, year, userRole, retryCount]);

  // ── MODE HARIAN ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (viewMode !== "harian" || !grade || !selectedDate) return;

    let cancelled = false;
    const fetchHarian = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ambil data presensi hari itu + daftar seluruh siswa di kelas
        const [presensiRes, siswaRes] = await Promise.all([
          StudentAttendanceService.getByGradeAndDate(grade, selectedDate),
          StudentAttendanceService.getStudentsByGrade(grade),
        ]);

        if (cancelled) return;

        const presensiList: StudentAttendanceType[] =
          presensiRes?.result ?? presensiRes?.data ?? [];
        const siswaList = siswaRes?.result ?? siswaRes?.data ?? [];
        const jumlahSiswa = siswaList.length;

        setTotalStudents(jumlahSiswa);

        // Hitung per-status — jika belum ada presensi anggap 0
        const hadir = presensiList.filter((p) => p.status === "hadir").length;
        const sakit = presensiList.filter((p) => p.status === "sakit").length;
        const izin = presensiList.filter((p) => p.status === "izin").length;
        const absen = presensiList.filter((p) => p.status === "absen").length;
        const total = presensiList.length; // siswa yang sudah tercatat

        setSummary({
          hadir,
          sakit,
          izin,
          absen,
          total: jumlahSiswa, // gunakan total siswa sebagai denominator
          hadirRate:
            jumlahSiswa > 0 ? Math.round((hadir / jumlahSiswa) * 100) : 0,
        });

        // Build per-student rows for tables (only recorded students)
        const rows: StudentAbsenceRow[] = presensiList.map((p) => ({
          studentId: p.studentId,
          name: p.name,
          hadir: p.status === "hadir" ? 1 : 0,
          sakit: p.status === "sakit" ? 1 : 0,
          izin: p.status === "izin" ? 1 : 0,
          absen: p.status === "absen" ? 1 : 0,
          total: 1,
          hadirRate: p.status === "hadir" ? 100 : 0,
        }));

        setStudentRows(rows);
        setGradeRows([]); // tidak relevan di mode harian
      } catch {
        if (!cancelled) {
          setError("Gagal memuat data presensi harian.");
          setSummary(null);
          setStudentRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    };

    fetchHarian();
    return () => { cancelled = true; };
  }, [viewMode, grade, selectedDate, retryCount]);

  // Reset initialLoading ketika mode berubah
  useEffect(() => {
    setInitialLoading(true);
    setSummary(null);
    setStudentRows([]);
  }, [viewMode]);

  // ── Derived data (bulanan only makes sense for these) ───────────────────
  const topAbsen = viewMode === "bulanan"
    ? [...studentRows].filter((r) => r.absen > 0).sort((a, b) => b.absen - a.absen).slice(0, 5)
    : studentRows.filter((r) => r.hadir === 0); // hari ini yang tidak hadir

  const topLowHadir = viewMode === "bulanan"
    ? [...studentRows]
        .filter((r) => r.total > 0 && r.hadirRate < 100)
        .sort((a, b) => a.hadirRate - b.hadirRate)
        .slice(0, 5)
    : studentRows.filter((r) => r.hadir === 0); // hari ini yang tidak hadir

  const hasData =
    summary !== null &&
    (viewMode === "harian"
      ? studentRows.length > 0
      : summary.total > 0 || totalStudents > 0);

  // Rata-rata hari hadir per siswa (untuk label tambahan di mode bulanan)
  const avgHadirPerSiswa =
    viewMode === "bulanan" && totalStudents > 0 && summary
      ? Math.round((summary.hadir / totalStudents) * 10) / 10
      : null;

  return {
    viewMode,
    setViewMode,
    grade,
    setGrade,
    month,
    setMonth,
    year,
    setYear,
    selectedDate,
    setSelectedDate,
    trendYear,
    setTrendYear,
    summary,
    studentRows,
    gradeRows,
    topAbsen,
    topLowHadir,
    totalStudents,
    avgHadirPerSiswa,
    loading,
    initialLoading,
    error,
    retry,
    hasData,
    AVAILABLE_YEARS,
  };
}
