"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import StudentSavingsService from "@/services/student-savings.service";
import { formatCompactRupiah } from "@/lib/format";

export interface StudentWithBalance {
  studentId: string;
  name: string;
  grade: string;
  balance: number;
  todayDeposit?: number;
  todayWithdrawal?: number;
}

export interface StudentSavingsSummary {
  grade: string;
  date: string;
  totalStudents: number;
  dailyDeposits: number;
  dailyWithdrawals: number;
}

export const GRADES = ["1", "2", "3", "4", "5", "6"];
const ITEMS_PER_PAGE = 5;
const HISTORY_LIMIT = 10;

export function useStudentSavings() {
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<string | null>(null);
  const [grade, setGrade] = useState("1");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  const [students, setStudents] = useState<StudentWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [summary, setSummary] = useState<StudentSavingsSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [txModal, setTxModal] = useState<{
    open: boolean;
    student: StudentWithBalance | null;
    mode: "simpan" | "tarik";
  }>({ open: false, student: null, mode: "simpan" });
  const [txAmount, setTxAmount] = useState("");
  const [txDescription, setTxDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [historyModal, setHistoryModal] = useState<{
    open: boolean;
    student: StudentWithBalance | null;
  }>({ open: false, student: null });
  const [historyType, setHistoryType] = useState<string | undefined>(undefined);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<any | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    txId: string | null;
  }>({ open: false, txId: null });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    transaction: any | null;
  }>({ open: false, transaction: null });
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  // Fetch students by grade
  useEffect(() => {
    if (!grade) return;
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await StudentSavingsService.getByGrade(grade, date);
        if (!cancelled) {
          setStudents(res?.result || []);
          setCurrentPage(1);
        }
      } catch (e: any) {
        if (!cancelled) {
          setStudents([]);
          setMessage({ type: "error", text: e.message || "Gagal memuat data" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [grade, date]);

  // Fetch summary
  useEffect(() => {
    if (!grade || !date) return;
    let cancelled = false;
    const fetchSummary = async () => {
      setSummaryLoading(true);
      try {
        const res = await StudentSavingsService.getSummary(grade, date);
        if (!cancelled) {
          setSummary(res?.result || null);
        }
      } catch {
        if (!cancelled) setSummary(null);
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    };
    fetchSummary();
    return () => {
      cancelled = true;
    };
  }, [grade, date]);

  const openTxModal = useCallback(
    (student: StudentWithBalance, mode: "simpan" | "tarik") => {
      setTxModal({ open: true, student, mode });
      setTxAmount("");
      setTxDescription("");
    },
    []
  );

  const closeTxModal = useCallback(() => {
    setTxModal({ open: false, student: null, mode: "simpan" });
    setTxAmount("");
    setTxDescription("");
  }, []);

  const handleSaveTransaction = useCallback(async () => {
    if (!txModal.student) return;
    const amount = parseInt(txAmount.replace(/\./g, ""));
    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Jumlah harus lebih dari 0!" });
      return;
    }
    if (txModal.mode === "tarik" && !txDescription.trim()) {
      setMessage({ type: "error", text: "Catatan penarikan harus diisi!" });
      return;
    }
    if (txModal.mode === "tarik" && amount > txModal.student.balance) {
      setMessage({
        type: "error",
        text: `Saldo tidak mencukupi! Saldo saat ini: ${formatCompactRupiah(txModal.student.balance)}`,
      });
      return;
    }
    const today = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();
    if (date < today) {
      setMessage({ type: "error", text: "Tidak bisa mencatat transaksi untuk tanggal yang sudah lewat!" });
      return;
    }
    if (date > today) {
      setMessage({ type: "error", text: "Tidak bisa mencatat transaksi untuk tanggal yang akan datang!" });
      return;
    }
    setSaving(true);
    try {
      const res = await StudentSavingsService.createTransaction({
        studentId: txModal.student.studentId,
        type: txModal.mode,
        amount,
        date,
        description: txDescription || undefined,
      });
      if (res?.status?.response === "success") {
        setMessage({ type: "success", text: "Transaksi berhasil dicatat!" });
        closeTxModal();
        // Refresh data
        const res2 = await StudentSavingsService.getByGrade(grade, date);
        setStudents(res2?.result || []);
        const res3 = await StudentSavingsService.getSummary(grade, date);
        setSummary(res3?.result || null);
      } else {
        setMessage({
          type: "error",
          text: res?.status?.message || "Gagal menyimpan transaksi",
        });
      }
    } catch (e: any) {
      setMessage({
        type: "error",
        text: e.message || "Gagal menyimpan transaksi",
      });
    } finally {
      setSaving(false);
    }
  }, [txModal, txAmount, txDescription, grade, date, closeTxModal]);

  const openHistoryModal = useCallback(async (student: StudentWithBalance, type?: string) => {
    setHistoryModal({ open: true, student });
    setHistoryPage(1);
    setHistoryType(type);
    setHistoryLoading(true);
    try {
      const res = await StudentSavingsService.getTransactions(
        student.studentId,
        1,
        HISTORY_LIMIT,
        type
      );
      if (res?.result) {
        setTransactions(res.result.transactions || []);
        setHistoryTotal(res.result.total || 0);
        setHistoryTotalPages(res.result.totalPages || 0);
      }
    } catch {
      setTransactions([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const closeHistoryModal = useCallback(() => {
    setHistoryModal({ open: false, student: null });
    setTransactions([]);
    setEditingTx(null);
  }, []);

  const fetchHistoryPage = useCallback(async (page: number) => {
    if (!historyModal.student) return;
    setHistoryLoading(true);
    setHistoryPage(page);
    try {
      const res = await StudentSavingsService.getTransactions(
        historyModal.student.studentId,
        page,
        HISTORY_LIMIT,
        historyType
      );
      if (res?.result) {
        setTransactions(res.result.transactions || []);
        setHistoryTotal(res.result.total || 0);
        setHistoryTotalPages(res.result.totalPages || 0);
      }
    } catch {
      setTransactions([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [historyModal.student]);

  const openEditModal = useCallback((tx: any) => {
    setEditModal({ open: true, transaction: tx });
    setEditAmount(String(tx.amount));
    setEditDate(tx.date);
    setEditDescription(tx.description || "");
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModal({ open: false, transaction: null });
    setEditAmount("");
    setEditDate("");
    setEditDescription("");
  }, []);

  const submitEditTransaction = useCallback(async () => {
    const tx = editModal.transaction;
    if (!tx) return;
    const amountNum = parseInt(editAmount.replace(/\./g, ""));
    if (!amountNum || amountNum <= 0) {
      setMessage({ type: "error", text: "Jumlah harus lebih dari 0!" });
      return;
    }
    if (!editDate) {
      setMessage({ type: "error", text: "Tanggal harus diisi!" });
      return;
    }
    if (tx.type === "tarik" && !editDescription.trim()) {
      setMessage({ type: "error", text: "Catatan penarikan harus diisi!" });
      return;
    }
    setEditSaving(true);
    try {
      const res = await StudentSavingsService.updateTransaction(tx._id, {
        type: tx.type,
        amount: amountNum,
        date: editDate,
      });
      if (res?.status?.response === "success") {
        setMessage({ type: "success", text: "Transaksi berhasil diperbarui!" });
        closeEditModal();
        await fetchHistoryPage(historyPage);
        const res2 = await StudentSavingsService.getByGrade(grade, date);
        setStudents(res2?.result || []);
        const res3 = await StudentSavingsService.getSummary(grade, date);
        setSummary(res3?.result || null);
      } else {
        setMessage({
          type: "error",
          text: res?.status?.message || "Gagal memperbarui transaksi",
        });
      }
    } catch (e: any) {
      setMessage({
        type: "error",
        text: e.message || "Gagal memperbarui transaksi",
      });
    } finally {
      setEditSaving(false);
    }
  }, [editModal, editAmount, editDate, editDescription, grade, date, historyPage, fetchHistoryPage, closeEditModal]);

  const handleDeleteTransaction = useCallback(
    async (txId: string) => {
      setConfirmDelete({ open: true, txId });
    },
    []
  );

  const closeConfirmDelete = useCallback(() => {
    setConfirmDelete({ open: false, txId: null });
  }, []);

  const submitDeleteTransaction = useCallback(
    async () => {
      const txId = confirmDelete.txId;
      if (!txId) return;
      setDeletingId(txId);
      try {
        const res = await StudentSavingsService.deleteTransaction(txId);
        if (res?.status?.response === "success") {
          setMessage({ type: "success", text: "Transaksi berhasil dihapus!" });
          closeConfirmDelete();
          await fetchHistoryPage(historyPage);
          const res2 = await StudentSavingsService.getByGrade(grade, date);
          setStudents(res2?.result || []);
          const res3 = await StudentSavingsService.getSummary(grade, date);
          setSummary(res3?.result || null);
        } else {
          setMessage({
            type: "error",
            text: res?.status?.message || "Gagal menghapus transaksi",
          });
        }
      } catch (e: any) {
        setMessage({
          type: "error",
          text: e.message || "Gagal menghapus transaksi",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [confirmDelete, grade, historyPage, fetchHistoryPage, date, closeConfirmDelete]
  );

  const exportExcel = useCallback(() => {
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
  }, [students, grade]);

  // Pagination
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return {
    userRole,
    userGrade,
    grade,
    setGrade,
    date,
    setDate,
    students,
    paginatedStudents,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    summary,
    summaryLoading,
    message,
    setMessage,
    txModal,
    openTxModal,
    closeTxModal,
    txAmount,
    setTxAmount,
    txDescription,
    setTxDescription,
    saving,
    handleSaveTransaction,
    historyModal,
    openHistoryModal,
    closeHistoryModal,
    transactions,
    historyLoading,
    historyPage,
    historyTotalPages,
    editingTx,
    deletingId,
    editModal,
    editAmount,
    setEditAmount,
    editDate,
    setEditDate,
    editDescription,
    setEditDescription,
    editSaving,
    openEditModal,
    closeEditModal,
    submitEditTransaction,
    confirmDelete,
    closeConfirmDelete,
    submitDeleteTransaction,
    handleDeleteTransaction,
    fetchHistoryPage,
    formatCompactRupiah,
    exportExcel,
  };
}
