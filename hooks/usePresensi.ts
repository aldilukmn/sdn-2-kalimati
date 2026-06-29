"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import StudentAttendanceService from "@/services/student-attendance.service";
import UserService from "@/services/user.service";

export interface Entry {
  studentId: string;
  name: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
}

export const STATUS_LABEL: Record<string, string> = {
  hadir: "Hadir",
  sakit: "Sakit",
  izin: "Izin",
  alpha: "Alpha",
};

export const STATUS_BTN: Record<string, string> = {
  hadir:
    "bg-green-500 hover:bg-green-600 text-white ring-2 ring-green-300 dark:ring-green-700",
  sakit:
    "bg-yellow-500 hover:bg-yellow-600 text-white ring-2 ring-yellow-300 dark:ring-yellow-700",
  izin: "bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-700",
  alpha:
    "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-300 dark:ring-red-700",
};

export const GRADES = ["1", "2", "3", "4", "5", "6"];
export const ITEMS_PER_PAGE = 10;

export function usePresensi() {
  const router = useRouter();

  const [grade, setGrade] = useState("1");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<string | null>(null);
  const [isJwtReady, setIsJwtReady] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
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

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
        setUserGrade(payload.grade);
        if (payload.role === "guru" && payload.grade) {
          setGrade(payload.grade);
        }
      } catch {}
    }
    setIsJwtReady(true);
  }, []);

  useEffect(() => {
    if (userRole && userRole !== "guru" && userRole !== "admin" && userRole !== "kepala") {
      router.replace("/login");
    }
  }, [userRole, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [grade, date]);

  useEffect(() => {
    if (!isJwtReady || !grade) return;
    setTeacherLoading(true);
    UserService.getTeacherByGrade(grade)
      .then((res) => setTeacherName(res?.result?.fullName || null))
      .catch(() => setTeacherName(null))
      .finally(() => setTeacherLoading(false));
  }, [grade, isJwtReady]);

  useEffect(() => {
    if (!isJwtReady || !grade || !date) return;

    const hasEntries = entries.length > 0;

    const loadData = async () => {
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

        const siswaList: any[] = siswaRes.data || siswaRes.result || [];
        const presensiData: any[] =
          presensiRes.data || presensiRes.result || [];

        if (presensiData.length > 0) {
          const merged = siswaList.map((s: any) => {
            const existing = presensiData.find(
              (e: any) => e.studentId === s.studentId,
            );
            return {
              studentId: s.studentId,
              name: s.name,
              status: existing?.status || ("hadir" as const),
            };
          });
          setEntries(merged);
          setIsExisting(true);
          setMessage({
            type: "success",
            text: "Data presensi sudah ada. Silakan edit jika perlu.",
          });
        } else {
          setEntries(
            siswaList.map((s: any) => ({
              studentId: s.studentId,
              name: s.name,
              status: "hadir" as const,
            })),
          );
          setIsExisting(false);
        }
      } catch {
        setEntries([]);
        setIsExisting(false);
      } finally {
        setLoadingSiswa(false);
        setSyncing(false);
      }
    };

    loadData();
  }, [grade, date, isJwtReady]);

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

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = entries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    grade,
    setGrade,
    userRole,
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
    totalPages,
    startIndex,
    paginatedEntries,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}
