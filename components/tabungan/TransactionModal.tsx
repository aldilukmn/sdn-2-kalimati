"use client";

import { Save, Loader2 } from "lucide-react";
import { formatCompactRupiah } from "@/lib/format";
import { StudentWithBalance } from "@/hooks/useStudentList";
import Modal from "@/components/modals/Modal";

interface TransactionModalProps {
  open: boolean;
  student: StudentWithBalance | null;
  mode: "simpan" | "tarik";
  closeTxModal: () => void;
  txAmount: string;
  setTxAmount: (v: string) => void;
  txDescription: string;
  setTxDescription: (v: string) => void;
  saving: boolean;
  handleSaveTransaction: () => void;
}

export default function TransactionModal({
  open,
  student,
  mode,
  closeTxModal,
  txAmount,
  setTxAmount,
  txDescription,
  setTxDescription,
  saving,
  handleSaveTransaction,
}: TransactionModalProps) {
  if (!open || !student) return null;

  return (
    <Modal open onClose={closeTxModal} title={mode === "simpan" ? "Simpan" : "Tarik Tabungan"} className="max-w-md">
      <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">Murid</p>
            <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{student.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Saldo Saat Ini</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
              {formatCompactRupiah(student.balance)}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Jumlah</label>
            <input
              type="number"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              placeholder="Masukkan jumlah"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            />
            {txAmount && !isNaN(Number(txAmount)) && (
              <p className="text-xs text-blue-600 mt-1 dark:text-blue-400">
                Akan disimpan: Rp {(Number(txAmount) < 1000 ? Number(txAmount) * 1000 : Number(txAmount)).toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              {mode === "simpan" ? "Keterangan (opsional)" : "Catatan penarikan"}
            </label>
            <input
              type="text"
              value={txDescription}
              onChange={(e) => setTxDescription(e.target.value)}
              placeholder={mode === "simpan" ? "Misal: Tabungan hari Jumat" : "Alasan penarikan (misal: beli buku)"}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={closeTxModal}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSaveTransaction}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
    </Modal>
  );
}
