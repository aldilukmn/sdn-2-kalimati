"use client";

import { useState } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import type { Transaction } from "@/types/student-savings";

export function useEditTransaction({
  refreshList,
  setMessage,
  fetchHistoryPage,
  historyPage,
}: {
  refreshList: () => Promise<void>;
  setMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
  fetchHistoryPage: (page: number) => Promise<void>;
  historyPage: number;
}) {
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    transaction: Transaction | null;
  }>({ open: false, transaction: null });
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const openEditModal = (tx: Transaction) => {
    setEditModal({ open: true, transaction: tx });
    setEditingTx(tx);
    setEditAmount(String(tx.amount));
    setEditDate(tx.date);
    setEditDescription(tx.description || "");
  };

  const closeEditModal = () => {
    setEditModal({ open: false, transaction: null });
    setEditingTx(null);
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

  return {
    editingTx,
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
  };
}
