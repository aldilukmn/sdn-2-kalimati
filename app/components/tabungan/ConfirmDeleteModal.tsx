"use client";

import { Loader2, Trash2 } from "lucide-react";
import Modal from "@/app/components/Modal";

interface ConfirmDeleteModalProps {
  open: boolean;
  txId: string | null;
  deletingId: string | null;
  closeConfirmDelete: () => void;
  submitDeleteTransaction: () => void;
}

export default function ConfirmDeleteModal({
  open,
  txId,
  deletingId,
  closeConfirmDelete,
  submitDeleteTransaction,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <Modal open onClose={closeConfirmDelete} className="max-w-sm">
      <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">Hapus Transaksi</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
      </p>
      <div className="flex gap-3">
        <button
          onClick={closeConfirmDelete}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
        >
          Batal
        </button>
        <button
          onClick={submitDeleteTransaction}
          disabled={deletingId === txId}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {deletingId === txId ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          Hapus
        </button>
      </div>
    </Modal>
  );
}
