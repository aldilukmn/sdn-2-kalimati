"use client";

import { useState } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import { formatCompactRupiah } from "@/lib/format";
import { StudentWithBalance } from "@/hooks/useStudentList";

export function useTransactionModal({
  grade,
  date,
  refreshList,
  setMessage,
}: {
  grade: string;
  date: string;
  refreshList: () => Promise<void>;
  setMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
}) {
  const [txModal, setTxModal] = useState<{
    open: boolean;
    student: StudentWithBalance | null;
    mode: "simpan" | "tarik";
  }>({ open: false, student: null, mode: "simpan" });
  const [txAmount, setTxAmount] = useState("");
  const [txDescription, setTxDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const openTxModal = (student: StudentWithBalance, mode: "simpan" | "tarik") => {
    setTxModal({ open: true, student, mode });
    setTxAmount("");
    setTxDescription("");
  };

  const closeTxModal = () => {
    setTxModal({ open: false, student: null, mode: "simpan" });
    setTxAmount("");
    setTxDescription("");
  };

  const handleSaveTransaction = async () => {
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
        await refreshList();
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
  };

  return {
    txModal,
    openTxModal,
    closeTxModal,
    txAmount,
    setTxAmount,
    txDescription,
    setTxDescription,
    saving,
    handleSaveTransaction,
  };
}
