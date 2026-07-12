"use client";

import Modal from "@/app/components/Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmDialog({
  id,
  onConfirm,
  onClose,
  submitting,
}: {
  id: string | null;
  onConfirm: (id: string) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  if (!id) return null;
  return (
    <Modal open onClose={onClose} className="max-w-sm text-center">
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">
          Konfirmasi Hapus
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(id)}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Ya, Hapus
          </button>
        </div>
    </Modal>
  );
}
