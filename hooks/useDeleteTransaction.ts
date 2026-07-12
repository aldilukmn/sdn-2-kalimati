"use client";

import { useState } from "react";
import StudentSavingsService from "@/services/student-savings.service";

export function useDeleteTransaction({
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
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    txId: string | null;
  }>({ open: false, txId: null });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteTransaction = (txId: string) => {
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
    confirmDelete,
    deletingId,
    handleDeleteTransaction,
    closeConfirmDelete,
    submitDeleteTransaction,
  };
}
