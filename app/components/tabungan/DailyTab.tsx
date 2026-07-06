"use client";

import {
  Users,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  FileDown,
  Plus,
  Minus,
  History,
} from "lucide-react";
import { StudentWithBalance, StudentSavingsSummary } from "@/hooks/useStudentList";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import Pagination from "@/app/components/Pagination";
import StatCard from "@/app/components/StatCard";
import { formatCompactRupiah } from "@/lib/format";

interface DailyTabProps {
  summary: StudentSavingsSummary | null;
  summaryLoading: boolean;
  students: StudentWithBalance[];
  paginatedStudents: StudentWithBalance[];
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  exportExcel: () => void;
  openTxModal: (student: StudentWithBalance, mode: "simpan" | "tarik") => void;
  openHistoryModal: (student: StudentWithBalance, type?: string, allTime?: boolean) => void;
}

export default function DailyTab({
  summary,
  summaryLoading,
  students,
  paginatedStudents,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  exportExcel,
  openTxModal,
  openHistoryModal,
}: DailyTabProps) {
  return (
    <>
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 animate-fadeIn relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            variant="simple"
            label="Penabung"
            value={summary?.totalStudents || 0}
            icon={Users}
            color="indigo"
            loading={summaryLoading}
            suffix=" murid"
          />
          <StatCard
            variant="simple"
            label="Setoran"
            value={formatCompactRupiah(summary?.dailyDeposits || 0)}
            icon={TrendingUp}
            color="emerald"
            loading={summaryLoading}
          />
          <StatCard
            variant="simple"
            label="Penarikan"
            value={formatCompactRupiah(summary?.dailyWithdrawals || 0)}
            icon={TrendingDown}
            color="rose"
            loading={summaryLoading}
          />
          <StatCard
            variant="simple"
            label="Selisih"
            value={formatCompactRupiah((summary?.dailyDeposits || 0) - (summary?.dailyWithdrawals || 0))}
            icon={ArrowLeftRight}
            color="amber"
            loading={summaryLoading}
            valueClassName={
              summaryLoading
                ? ""
                : (summary?.dailyDeposits || 0) - (summary?.dailyWithdrawals || 0) >= 0
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-600 dark:text-red-400"
            }
          />
        </div>
      </div>

      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm md:text-base font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
            Daftar Tabungan Murid
          </h2>
          <button
            onClick={exportExcel}
            disabled={loading || students.length === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <FileDown size={16} />
            Export Excel
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">No</th>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Nama</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Saldo</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Setoran</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Penarikan</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-6" /></td>
                    <td className="px-3 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40" /></td>
                    <td className="px-3 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mx-auto" /></td>
                    <td className="px-3 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mx-auto" /></td>
                    <td className="px-3 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mx-auto" /></td>
                    <td className="px-3 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 md:w-32 mx-auto" /></td>
                  </tr>
                ))
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-12 text-center text-gray-400">
                    Belum ada data tabungan untuk kelas ini
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s, i) => (
                  <tr key={s.studentId} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{startIndex + i + 1}</td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-800 dark:text-slate-100 whitespace-nowrap">{s.name}</td>
                    <td className="px-3 py-3 text-sm text-center font-semibold text-gray-800 dark:text-slate-100 whitespace-nowrap">{formatCompactRupiah(s.balance)}</td>
                    <td className="px-3 py-3 text-sm text-center text-emerald-700 dark:text-emerald-300 font-medium whitespace-nowrap">
                      {s.todayDeposit ? formatCompactRupiah(s.todayDeposit) : "-"}
                    </td>
                    <td className="px-3 py-3 text-sm text-center text-orange-600 dark:text-orange-400 font-medium whitespace-nowrap">
                      {s.todayWithdrawal ? formatCompactRupiah(s.todayWithdrawal) : "-"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          title="Simpan"
                          onClick={() => openTxModal(s, "simpan")}
                          className="flex items-center gap-1 p-1.5 md:px-2.5 md:py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                          <span className="hidden md:inline">Simpan</span>
                        </button>
                        <button
                          title="Tarik"
                          onClick={() => openTxModal(s, "tarik")}
                          className="flex items-center gap-1 p-1.5 md:px-2.5 md:py-1.5 rounded-lg text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                          <span className="hidden md:inline">Tarik</span>
                        </button>
                        <button
                          title="Riwayat"
                          onClick={() => openHistoryModal(s)}
                          className="flex items-center gap-1 p-1.5 md:px-2.5 md:py-1.5 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer"
                        >
                          <History size={14} />
                          <span className="hidden md:inline">Riwayat</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && paginatedStudents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={students.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}
      </div>
    </>
  );
}
