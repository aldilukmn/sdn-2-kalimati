"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentSavingsService from "@/services/student-savings.service";
import { decodeJWT } from "@/lib/jwt";
import { GRADES, ITEMS_PER_PAGE } from "@/lib/constants";

export interface StudentWithBalance {
  studentId: string;
  name: string;
  grade: string;
  balance: number;
  todayDeposit?: number;
  todayWithdrawal?: number;
}

export type StudentSavingsSummary = import("@/types/student-savings").SavingsSummary;

export function useStudentList() {
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<string | null>(null);
  const [isTreasurer, setIsTreasurer] = useState(false);
  const [userFullName, setUserFullName] = useState("");
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
    const token = sessionStorage.getItem("user_session");
    let role: string | null = null;
    let gradeFromToken: string | null = null;

    let treasurer = false;
    let fullName = "";

    if (token) {
      try {
        const payload = decodeJWT(token);
        if (payload) {
          role = payload.role;
          gradeFromToken = payload.grade;
          treasurer = payload.treasurer === true;
          fullName = payload.fullName || "";
        }
      } catch {}
    }

    if (!role) {
      const match = document.cookie.match(/(?:^|; )user_role=([^;]*)/);
      role = match ? decodeURIComponent(match[1]) : null;
      const gradeMatch = document.cookie.match(/(?:^|; )user_grade=([^;]*)/);
      gradeFromToken = gradeMatch ? decodeURIComponent(gradeMatch[1]) : null;
    }

    if (role) setUserRole(role);
    if (gradeFromToken) setUserGrade(gradeFromToken);
    setIsTreasurer(treasurer);
    setUserFullName(fullName);
    if (role === "guru" && gradeFromToken) setGrade(gradeFromToken);
  }, []);

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
    isTreasurer,
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
