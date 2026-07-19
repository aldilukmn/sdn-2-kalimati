"use client";

import Modal from "@/components/modals/Modal";

interface ConfirmDeleteModalProps {
  confirmDelete: { type: "subject" | "gradeSubject"; id: string; name: string } | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ confirmDelete, onClose, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal open={confirmDelete !== null} onClose={onClose} title="Konfirmasi Hapus" className="max-w-sm">
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
        Yakin ingin menghapus{confirmDelete?.type === "subject" ? " mata pelajaran" : " penetapan"} <strong>{confirmDelete?.name}</strong>?
        {confirmDelete?.type === "subject" && (
          <span className="block mt-1 text-xs text-slate-400">
            Tidak bisa dihapus jika masih terdaftar di kelas.
          </span>
        )}
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
        >
          Hapus
        </button>
      </div>
    </Modal>
  );
}
