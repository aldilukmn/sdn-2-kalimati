"use client";

import { Save, Loader2 } from "lucide-react";
import Modal from "@/app/components/Modal";

interface EditModalProps {
  open: boolean;
  transaction: any | null;
  closeEditModal: () => void;
  editAmount: string;
  setEditAmount: (v: string) => void;
  editDate: string;
  setEditDate: (v: string) => void;
  editDescription: string;
  setEditDescription: (v: string) => void;
  editSaving: boolean;
  submitEditTransaction: () => void;
}

export default function EditModal({
  open,
  transaction,
  closeEditModal,
  editAmount,
  setEditAmount,
  editDate,
  setEditDate,
  editDescription,
  setEditDescription,
  editSaving,
  submitEditTransaction,
}: EditModalProps) {
  if (!open || !transaction) return null;

  return (
    <Modal open onClose={closeEditModal} title="Edit Transaksi" className="max-w-md">
      <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">Tipe</p>
            <p className="text-sm font-medium text-gray-800 dark:text-slate-100 uppercase">{transaction.type}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Jumlah</label>
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Catatan{" "}
              {transaction.type === "tarik" ? (
                <span className="text-rose-500">*</span>
              ) : (
                "(opsional)"
              )}
            </label>
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder={transaction.type === "tarik" ? "Alasan penarikan (wajib)" : "Misal: Beli buku"}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={closeEditModal}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={submitEditTransaction}
            disabled={editSaving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {editSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Simpan
          </button>
        </div>
    </Modal>
  );
}
