"use client";

import { useState } from "react";
import { X, Pencil, Trash2, Loader2, Info } from "lucide-react";
import { formatCompactRupiah, formatDateID, formatDateShort, MONTHS_ID } from "@/lib/format";
import { StudentWithBalance } from "@/hooks/useStudentList";
import type { Transaction } from "@/types/student-savings";
import Modal from "@/app/components/Modal";
import YearSelect from "@/app/components/YearSelect";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryModalProps {
  open: boolean;
  student: StudentWithBalance | null;
  closeHistoryModal: () => void;
  historyType: string | undefined;
  setHistoryType: (t: string | undefined) => void;
  historyMonth: number;
  setHistoryMonth: (m: number) => void;
  historyYear: number;
  setHistoryYear: (y: number) => void;
  historyAllTime: boolean;
  transactions: Transaction[];
  historyLoading: boolean;
  historyPage: number;
  historyTotal: number;
  historyTotalPages: number;
  fetchHistoryPage: (page: number, type?: string, month?: number, year?: number) => void;
  editSaving: boolean;
  openEditModal: (tx: Transaction) => void;
  handleDeleteTransaction: (txId: string) => void;
  deletingId: string | null;
}

export default function HistoryModal({
  open,
  student,
  closeHistoryModal,
  historyType,
  setHistoryType,
  historyMonth,
  setHistoryMonth,
  historyYear,
  setHistoryYear,
  historyAllTime,
  transactions,
  historyLoading,
  historyPage,
  historyTotal,
  historyTotalPages,
  fetchHistoryPage,
  editSaving,
  openEditModal,
  handleDeleteTransaction,
  deletingId,
}: HistoryModalProps) {
  const [infoDescription, setInfoDescription] = useState<string | null>(null);

  if (!open || !student) return null;

  return (
    <>
      <Modal open onClose={closeHistoryModal} className="max-w-2xl max-h-[80vh] flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100">
              {historyAllTime ? "Riwayat Penarikan" : "Riwayat Transaksi"}
              <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
                {historyLoading ? (
                  <span className="inline-block w-8 h-3.5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse align-middle" />
                ) : (
                  `(${historyTotal})`
                )}
              </span>
            </h3>
            <button
              onClick={closeHistoryModal}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
            <p className="text-xs text-gray-500 mt-1">{student.name}</p>
            <div className="flex items-center justify-between mt-2">
              {!historyAllTime && (
              <div className="flex gap-1 bg-slate-100 dark:bg-gray-800 rounded-lg p-0.5">
                {(["all", "simpan", "tarik"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      const newType = t === "all" ? "all" : t;
                      setHistoryType(t === "all" ? undefined : t);
                      fetchHistoryPage(1, newType);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      (t === "all" ? historyType === undefined : historyType === t)
                        ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                  >
                    {t === "all" ? "Semua" : t === "simpan" ? "Simpan" : "Tarik"}
                  </button>
                ))}
              </div>
              )}
              {!historyAllTime && (
              <div className="flex items-center gap-1.5">
                <Select
                  value={String(historyMonth)}
                  onValueChange={(v) => {
                    if (v !== null) {
                      const newMonth = Number(v);
                      setHistoryMonth(newMonth);
                      fetchHistoryPage(1, historyType, newMonth, historyYear);
                    }
                  }}
                >
                  <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[50px] md:w-[90px]">
                    <SelectValue placeholder="Bulan" className="sr-only" />
                    {MONTHS_ID[historyMonth - 1]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bulan</SelectLabel>
                      {MONTHS_ID.map((name, i) => (
                        <SelectItem key={i} value={String(i + 1)}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <YearSelect
                  value={historyYear}
                  onChange={(y) => {
                    setHistoryYear(y);
                    fetchHistoryPage(1, historyType, historyMonth, y);
                  }}
                  compact
                />
              </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm hover:from-indigo-600 hover:to-purple-600">
                    <TableHead className="font-semibold text-white">Tanggal</TableHead>
                    <TableHead className="font-semibold text-white">Tipe</TableHead>
                    <TableHead className="font-semibold text-white">Jumlah</TableHead>
                    {historyType !== "simpan" && (
                      <TableHead className="font-semibold text-white">Keterangan</TableHead>
                    )}
                    <TableHead className="font-semibold text-white">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" /></TableCell>
                        <TableCell><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12 mx-auto" /></TableCell>
                        <TableCell><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 ml-auto" /></TableCell>
                        {historyType !== "simpan" && (
                        <TableCell><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mx-auto" /></TableCell>
                        )}
                        <TableCell><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mx-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={historyType === "simpan" ? 4 : 5} className="text-center py-8 text-gray-400">
                        Belum ada transaksi
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx._id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors text-center">
                        <TableCell className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          <span className="hidden md:inline">{formatDateID(tx.date)}</span>
                          <span className="md:hidden">{formatDateShort(tx.date)}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs md:text-sm ${
                            tx.type === "simpan"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                          }`}>
                            {tx.type === "simpan" ? "Simpan" : "Tarik"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs md:text-sm font-medium text-gray-800 dark:text-slate-100">
                          {formatCompactRupiah(tx.amount)}
                        </TableCell>
                        {historyType !== "simpan" && (
                        <TableCell className="text-center">
                          {historyType === undefined && tx.type === "simpan" ? (
                            "-"
                          ) : (
                            <button
                              onClick={() => setInfoDescription(tx.description || "Tidak ada keterangan")}
                              className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
                              title={tx.description || ""}
                            >
                              <Info size={14} />
                            </button>
                          )}
                        </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(tx)}
                              disabled={editSaving}
                              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-40"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(tx._id)}
                              disabled={deletingId === tx._id}
                              className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer disabled:opacity-40"
                            >
                              {deletingId === tx._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {historyTotalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-gray-700">
              <p className="text-xs text-gray-500">
                Halaman {historyPage} dari {historyTotalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchHistoryPage(historyPage - 1)}
                  disabled={historyPage <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-gray-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => fetchHistoryPage(historyPage + 1)}
                  disabled={historyPage >= historyTotalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-gray-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
      </Modal>

      {infoDescription && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={() => setInfoDescription(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-slate-200 dark:border-gray-700 p-4 max-w-xs w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                Keterangan Penarikan
              </p>
              <button
                onClick={() => setInfoDescription(null)}
                className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-700 dark:text-slate-100">{infoDescription}</p>
          </div>
        </div>
      )}
    </>
  );
}
