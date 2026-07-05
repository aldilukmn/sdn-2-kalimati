"use client";

import { useState } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import { StudentWithBalance } from "@/hooks/useStudentList";
import type { Transaction } from "@/types/student-savings";

const HISTORY_LIMIT = 10;

export function useHistoryModal({
  refreshList,
  setMessage,
}: {
  refreshList: () => Promise<void>;
  setMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
}) {
  const [historyModal, setHistoryModal] = useState<{
    open: boolean;
    student: StudentWithBalance | null;
  }>({ open: false, student: null });
  const [historyType, setHistoryType] = useState<string | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  const [historyMonth, setHistoryMonth] = useState(new Date().getMonth() + 1);
  const [historyYear, setHistoryYear] = useState(new Date().getFullYear());
  const [historyAllTime, setHistoryAllTime] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    txId: string | null;
  }>({ open: false, txId: null });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    transaction: Transaction | null;
  }>({ open: false, transaction: null });
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const openHistoryModal = async (student: StudentWithBalance, type?: string, allTime?: boolean) => {
    const curMonth = new Date().getMonth() + 1;
    const curYear = new Date().getFullYear();
    setHistoryModal({ open: true, student });
    setHistoryPage(1);
    setHistoryType(type);
    setHistoryAllTime(!!allTime);
    setHistoryMonth(curMonth);
    setHistoryYear(curYear);
    setHistoryLoading(true);
    try {
      const res = await StudentSavingsService.getTransactions(
        student.studentId,
        1,
        HISTORY_LIMIT,
        type,
        allTime ? undefined : curMonth,
        allTime ? undefined : curYear
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
  };

  const closeHistoryModal = () => {
    setHistoryModal({ open: false, student: null });
    setTransactions([]);
    setEditingTx(null);
    setHistoryAllTime(false);
  };

  const fetchHistoryPage = async (page: number, type?: string, month?: number, year?: number) => {
    if (!historyModal.student) return;
    setHistoryLoading(true);
    setHistoryPage(page);
    const filterType = type === "all" ? undefined : type !== undefined ? type : historyType;
    const filterMonth = month !== undefined ? month : historyMonth;
    const filterYear = year !== undefined ? year : historyYear;
    try {
      const res = await StudentSavingsService.getTransactions(
        historyModal.student.studentId,
        page,
        HISTORY_LIMIT,
        filterType,
        historyAllTime ? undefined : filterMonth,
        historyAllTime ? undefined : filterYear
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
  };

  const openEditModal = (tx: Transaction) => {
    setEditModal({ open: true, transaction: tx });
    setEditAmount(String(tx.amount));
    setEditDate(tx.date);
    setEditDescription(tx.description || "");
  };

  const closeEditModal = () => {
    setEditModal({ open: false, transaction: null });
    setEditAmount("");
    setEditDate("");
    setEditDescription("");
  };

  const submitEditTransaction = async () => {
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
        description: editDescription.trim(),
      });
      if (res?.status?.response === "success") {
        setMessage({ type: "success", text: "Transaksi berhasil diperbarui!" });
        closeEditModal();
        await fetchHistoryPage(historyPage);
        await refreshList();
      } else {
        setMessage({
          type: "error",
          text: res?.status?.message || "Gagal memperbarui transaksi",
        });
      }
    } catch (e: unknown) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Gagal memperbarui transaksi",
      });
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteTransaction = async (txId: string) => {
    setConfirmDelete({ open: true, txId });
  };

  const closeConfirmDelete = () => {
    setConfirmDelete({ open: false, txId: null });
  };

  const submitDeleteTransaction = async () => {
    const txId = confirmDelete.txId;
    if (!txId) return;
    setDeletingId(txId);
    try {
      const res = await StudentSavingsService.deleteTransaction(txId);
      if (res?.status?.response === "success") {
        setMessage({ type: "success", text: "Transaksi berhasil dihapus!" });
        closeConfirmDelete();
        await fetchHistoryPage(historyPage);
        await refreshList();
      } else {
        setMessage({
          type: "error",
          text: res?.status?.message || "Gagal menghapus transaksi",
        });
      }
    } catch (e: unknown) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Gagal menghapus transaksi",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return {
    historyModal,
    openHistoryModal,
    closeHistoryModal,
    historyType,
    setHistoryType,
    historyMonth,
    setHistoryMonth,
    historyYear,
    setHistoryYear,
    historyAllTime,
    setHistoryAllTime,
    transactions,
    historyLoading,
    historyPage,
    historyTotal,
    historyTotalPages,
    fetchHistoryPage,
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
  };
}
