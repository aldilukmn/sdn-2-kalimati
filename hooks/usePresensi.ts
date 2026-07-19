"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import StudentAttendanceService from "@/services/student-attendance.service";
import UserService from "@/services/user.service";
import { getTodayLocal } from "@/lib/format";
import { GRADES, ITEMS_PER_PAGE } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useHolidays } from "@/hooks/useHolidays";
import type { StudentAttendanceRequestType, MasterStudentType, StudentAttendanceType } from "@/types/attendance";

export interface Entry {
  studentId: string;
  name: string;
  status: "hadir" | "sakit" | "izin" | "absen";
}

export const STATUS_LABEL: Record<string, string> = {
  hadir: "Hadir",
  sakit: "Sakit",
  izin: "Izin",
  absen: "Absen",
};

export const STATUS_BTN: Record<string, string> = {
  hadir:
    "bg-green-500 hover:bg-green-600 text-white ring-2 ring-green-300 dark:ring-green-700",
  sakit:
    "bg-yellow-500 hover:bg-yellow-600 text-white ring-2 ring-yellow-300 dark:ring-yellow-700",
  izin: "bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-700",
  absen:
    "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-300 dark:ring-red-700",
};



export function usePresensi() {
  const router = useRouter();

  const [grade, setGrade] = useState("1");
  const { role, grade: authGrade, isLoading: authLoading } = useAuth();

  const [date, setDate] = useState(getTodayLocal());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isExisting, setIsExisting] = useState(false);
  const [loadingSiswa, setLoadingSiswa] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { holidayList, holidays, loaded: holidaysLoaded, refresh: refreshHolidays, isHoliday: checkHoliday } = useHolidays();

  useEffect(() => {
    if (role === "guru" && authGrade) setGrade(authGrade);
  }, [role, authGrade]);

  useEffect(() => {
    if (role && role !== "guru" && role !== "admin" && role !== "kepala") {
      router.replace("/login");
    }
  }, [role, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [grade, date]);

  useEffect(() => {
    if (authLoading || !grade) return;
    setTeacherLoading(true);
    UserService.getTeacherByGrade(grade)
      .then((res) => setTeacherName(res?.result?.fullName || null))
      .catch(() => setTeacherName(null))
      .finally(() => setTeacherLoading(false));
  }, [grade, authLoading]);

  useEffect(() => {
    if (authLoading || !grade || !date) return;
    if (!holidaysLoaded) return;

    let cancelled = false;

    const hasEntries = entries.length > 0;

    const loadData = async () => {
      if (checkHoliday(date)) {
        setEntries([]);
        setIsExisting(false);
        setMessage(null);
        setLoadingSiswa(false);
        setSyncing(false);
        return;
      }
      if (hasEntries) {
        setSyncing(true);
      } else {
        setLoadingSiswa(true);
      }
      try {
        const [siswaRes, presensiRes] = await Promise.all([
          StudentAttendanceService.getStudentsByGrade(grade),
          StudentAttendanceService.getByGradeAndDate(grade, date),
        ]);

        if (cancelled) return;

        const siswaList = siswaRes.data || siswaRes.result || [];
        const presensiData =
          presensiRes.data || presensiRes.result || [];

        if (presensiData.length > 0) {
          const merged = siswaList.map((s: MasterStudentType) => {
            const existing = presensiData.find(
              (e: StudentAttendanceType) => e.studentId === s.studentId,
            );
            return {
              studentId: s.studentId,
              name: s.name,
              status: existing?.status || ("hadir" as const),
            };
          });
          setEntries(merged);
          setIsExisting(true);
          if (!isExisting) {
            setMessage({
              type: "success",
              text: "Data presensi sudah ada. Silakan edit jika perlu.",
            });
          }
        } else {
          setEntries(
            siswaList.map((s: MasterStudentType) => ({
              studentId: s.studentId,
              name: s.name,
              status: "hadir" as const,
            })),
          );
          setIsExisting(false);
        }
      } catch (err) {
        if (cancelled) return;
        setEntries([]);
        setIsExisting(false);
        setMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Gagal memuat data murid",
        });
      } finally {
        if (!cancelled) {
          setLoadingSiswa(false);
          setSyncing(false);
        }
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [grade, date, authLoading, holidays, holidaysLoaded]);

  const handleStatusChange = useCallback(
    (studentId: string, status: Entry["status"]) => {
      setEntries((prev) =>
        prev.map((e) => (e.studentId === studentId ? { ...e, status } : e)),
      );
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!date || !grade || entries.length === 0) return;
    if (checkHoliday(date)) {
      setMessage({ type: "error", text: "Tidak bisa menyimpan presensi di hari libur!" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload: StudentAttendanceRequestType = {
        date,
        grade,
        entries: entries.map((e) => ({
          studentId: e.studentId,
          status: e.status,
        })),
      };
      await StudentAttendanceService.create(payload);
      setMessage({
        type: "success",
        text: isExisting
          ? "Data presensi berhasil diperbarui!"
          : "Data presensi berhasil disimpan!",
      });
      setIsExisting(true);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Gagal menyimpan data presensi",
      });
    } finally {
      setSaving(false);
    }
  }, [date, grade, entries, isExisting]);

  const countByStatus = useCallback(
    (status: string) => entries.filter((e) => e.status === status).length,
    [entries],
  );

  const clearMessage = useCallback(() => setMessage(null), []);

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = entries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isHoliday = checkHoliday(date);

  return {
    grade,
    setGrade,
    userRole: role,
    date,
    setDate,
    entries,
    saving,
    message,
    isExisting,
    loadingSiswa,
    syncing,
    teacherName,
    teacherLoading,
    currentPage,
    setCurrentPage,
    handleStatusChange,
    handleSave,
    countByStatus,
    clearMessage,
    totalPages,
    startIndex,
    paginatedEntries,
    itemsPerPage: ITEMS_PER_PAGE,
    holidays,
    isHoliday,
    holidayList,
    holidaysLoaded,
    refreshHolidays,
  };
}
