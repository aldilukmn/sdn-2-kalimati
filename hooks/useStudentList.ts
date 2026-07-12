"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentSavingsService from "@/services/student-savings.service";
import { GRADES, ITEMS_PER_PAGE } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export interface StudentWithBalance {
  studentId: string;
  name: string;
  grade: string;
  balance: number;
  todayDeposit?: number;
  todayWithdrawal?: number;
}

import type { SavingsSummary } from "@/types/student-savings";

export type StudentSavingsSummary = SavingsSummary;

export function useStudentList() {
  const router = useRouter();

  const { role, grade: authGrade, payload } = useAuth();
  const userGrade = authGrade;
  const userRole = role;
  const isSavingsHolder = (payload?.savingsHolder === true) || false;
  const userFullName = typeof payload?.fullName === "string" ? payload.fullName : "";

  const [grade, setGrade] = useState("1");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  const [students, setStudents] = useState<StudentWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (role === "guru" && authGrade) setGrade(authGrade);
  }, [role, authGrade]);

  useEffect(() => {
    if (
      userRole &&
      userRole !== "guru" &&
      userRole !== "admin" &&
      userRole !== "kepala"
    ) {
      router.replace("/login");
    }
  }, [userRole, router]);

  useEffect(() => {
    if (!grade) return;
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      setLoading(true);
      try {
        const res = await StudentSavingsService.getByGrade(grade, date);
        if (!signal.aborted) {
          setStudents(res?.result || []);
          setCurrentPage(1);
        }
      } catch (e: unknown) {
        if (!signal.aborted) {
          setStudents([]);
          setMessage({ type: "error", text: e instanceof Error ? e.message : "Gagal memuat data" });
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [grade, date]);

  const refreshList = async () => {
    const res = await StudentSavingsService.getByGrade(grade, date);
    setStudents(res?.result || []);
  };

  const exportExcel = () => {
    import("xlsx").then((XLSX) => {
      const data = students.map((s, i) => ({
        No: i + 1,
        "NIS": s.studentId,
        Nama: s.name,
        Kelas: s.grade,
        Saldo: s.balance,
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tabungan");
      ws["!cols"] = [
        { wch: 4 },
        { wch: 12 },
        { wch: 30 },
        { wch: 6 },
        { wch: 15 },
      ];
      XLSX.writeFile(wb, `Tabungan_Kelas_${grade}.xlsx`);
    });
  };

  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return {
    userRole,
    userGrade,
    isSavingsHolder,
    grade,
    setGrade,
    userFullName,
    date,
    setDate,
    students,
    paginatedStudents,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    message,
    setMessage,
    refreshList,
    exportExcel,
  };
}
