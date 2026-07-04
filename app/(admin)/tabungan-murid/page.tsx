"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  Minus,
  History,
  FileDown,
  Save,
  X,
  Loader2,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
} from "lucide-react";
import { useStudentSavings, GRADES } from "@/hooks/useStudentSavings";
import { useStudentMonthlyBreakdown } from "@/hooks/useStudentMonthlyBreakdown";
import Pagination from "@/app/components/Pagination";
import DateDayPicker from "@/app/components/DateDayPicker";
import toast from "react-hot-toast";
import { formatCompactRupiah, formatDateID, formatDateShort } from "@/lib/format";
import LoadingDots from "@/app/components/LoadingDots";

export default function TabunganMuridPage() {
  const {
    userRole,
    userGrade,
    grade,
    setGrade,
    date,
    setDate,
    paginatedStudents,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    summary,
    summaryLoading,
    message,
    setMessage,
    txModal,
    openTxModal,
    closeTxModal,
    txAmount,
    setTxAmount,
    txDescription,
    setTxDescription,
    saving,
    handleSaveTransaction,
    historyModal,
    openHistoryModal,
    closeHistoryModal,
    transactions,
    historyLoading,
    historyPage,
    historyTotalPages,
    editingTx,
    deletingId,
    confirmDelete,
    closeConfirmDelete,
    submitDeleteTransaction,
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
    handleDeleteTransaction,
    fetchHistoryPage,
    formatCompactRupiah,
    students,
    exportExcel,
  } = useStudentSavings();

  const [activeTab, setActiveTab] = useState<"harian" | "bulanan">("harian");
  const [year, setYear] = useState(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: monthlyData, loading: monthlyLoading } = useStudentMonthlyBreakdown(
    userRole === "guru" ? userGrade || grade : grade,
    year,
    refreshKey
  );

  useEffect(() => {
    if (message) {
      if (message.type === "success") {
        toast.success(message.text);
        setRefreshKey((k) => k + 1);
      } else {
        toast.error(message.text);
      }
      setMessage(null);
    }
  }, [message, setMessage]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative p-5 md:p-6 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/15 rounded-xl flex items-center justify-center animate-iconBounce">
            <Wallet size={26} className="md:size-[30px] text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg md:text-xl font-bold">
              Tabungan Murid
            </h1>
            <p className="text-indigo-200/80 text-xs md:text-sm mt-0.5">
              Kelola tabungan murid per kelas
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              Rombel
            </label>
            {userRole !== "admin" && userRole !== "kepala" ? (
              <div className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-800 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                Kelas {userGrade || grade}
              </div>
            ) : (
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 cursor-pointer"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Kelas {g}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              Tanggal
            </label>
            <DateDayPicker value={date} onChange={setDate} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("harian")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "harian"
              ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          Transaksi Harian
        </button>
        <button
          onClick={() => setActiveTab("bulanan")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "bulanan"
              ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          Rekap Bulanan
        </button>
      </div>

      {activeTab === "harian" ? (
        <>
          {/* Summary Cards */}
          <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 animate-fadeIn relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-indigo-50/80 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-200/50 dark:border-indigo-800/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users
                    size={14}
                    className="text-indigo-500 dark:text-indigo-400 shrink-0"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Penabung
                  </p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                  {summaryLoading ? (
                    <LoadingDots />
                  ) : (
                    `${summary?.totalStudents || 0} murid`
                  )}
                </p>
              </div>
              <div className="bg-emerald-50/80 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp
                    size={14}
                    className="text-emerald-500 dark:text-emerald-400 shrink-0"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Setoran
                  </p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {summaryLoading ? (
                    <LoadingDots />
                  ) : (
                    formatCompactRupiah(summary?.dailyDeposits || 0)
                  )}
                </p>
              </div>
              <div className="bg-rose-50/80 dark:bg-rose-950/20 rounded-xl p-4 border border-rose-200/50 dark:border-rose-800/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown
                    size={14}
                    className="text-rose-500 dark:text-rose-400 shrink-0"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Penarikan
                  </p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-rose-700 dark:text-rose-300">
                  {summaryLoading ? (
                    <LoadingDots />
                  ) : (
                    formatCompactRupiah(summary?.dailyWithdrawals || 0)
                  )}
                </p>
              </div>
              <div className="bg-amber-50/80 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <ArrowLeftRight
                    size={14}
                    className="text-amber-500 dark:text-amber-400 shrink-0"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Selisih
                  </p>
                </div>
                <p
                  className={`text-lg md:text-2xl font-bold ${
                    summaryLoading
                      ? ""
                      : (summary?.dailyDeposits || 0) -
                            (summary?.dailyWithdrawals || 0) >=
                          0
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {summaryLoading ? (
                    <LoadingDots />
                  ) : (
                    formatCompactRupiah(
                      (summary?.dailyDeposits || 0) -
                        (summary?.dailyWithdrawals || 0),
                    )
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Export + Table */}
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
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                      No
                    </th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                      Nama
                    </th>
                    <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                      Saldo
                    </th>
                    <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                      Setoran
                    </th>
                    <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                      Penarikan
                    </th>
                    <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-3 py-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-6" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mx-auto" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mx-auto" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mx-auto" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 md:w-32 mx-auto" />
                        </td>
                      </tr>
                    ))
                  ) : paginatedStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-12 text-center text-gray-400"
                      >
                        Belum ada data tabungan untuk kelas ini
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((s, i) => (
                      <tr
                        key={s.studentId}
                        className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {startIndex + i + 1}
                        </td>
                        <td className="px-3 py-3 text-sm font-medium text-gray-800 dark:text-slate-100 whitespace-nowrap">
                          {s.name}
                        </td>
                        <td className="px-3 py-3 text-sm text-center font-semibold text-gray-800 dark:text-slate-100 whitespace-nowrap">
                          {formatCompactRupiah(s.balance)}
                        </td>
                        <td className="px-3 py-3 text-sm text-center text-emerald-700 dark:text-emerald-300 font-medium whitespace-nowrap">
                          {s.todayDeposit
                            ? formatCompactRupiah(s.todayDeposit)
                            : "-"}
                        </td>
                        <td className="px-3 py-3 text-sm text-center text-orange-600 dark:text-orange-400 font-medium whitespace-nowrap">
                          {s.todayWithdrawal
                            ? formatCompactRupiah(s.todayWithdrawal)
                            : "-"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              title="Simpan"
                              onClick={() => openTxModal(s, "simpan")}
                              className="flex items-center gap-1 p-1.5 md:px-2.5 md:py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                            >
                              <Plus size={14} />
                              <span className="hidden md:inline">Simpan</span>
                            </button>
                            <button
                              title="Tarik"
                              onClick={() => openTxModal(s, "tarik")}
                              className="flex items-center gap-1 p-1.5 md:px-2.5 md:py-1.5 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer"
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
                itemsPerPage={10}
              />
            )}
          </div>
        </>
      ) : (
        <>
          {/* Rekap Bulanan */}
          <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Rekap Tabungan Bulanan
              </h2>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setYear((y) => y - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-14 text-center">
                  {year}
                </span>
                <button
                  onClick={() => setYear((y) => y + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                    <th className="px-2 py-2.5 text-left font-semibold">No</th>
                    <th className="px-2 py-2.5 text-left font-semibold whitespace-nowrap">
                      Nama
                    </th>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th
                        key={i}
                        className="px-2 py-2.5 text-center font-semibold min-w-[60px] whitespace-nowrap"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </th>
                    ))}
                    <th className="px-2 py-2.5 text-center font-semibold min-w-[70px] whitespace-nowrap">
                      Saldo
                    </th>
                    <th className="px-2 py-2.5 text-center font-semibold min-w-[50px] whitespace-nowrap">
                      Tarik
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {monthlyLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-2 py-2.5">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-6" />
                        </td>
                        <td className="px-2 py-2.5">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                        </td>
                        {Array.from({ length: 14 }).map((_, j) => (
                          <td key={j} className="px-2 py-2.5">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12 mx-auto" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : monthlyData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={16}
                        className="px-3 py-12 text-center text-gray-400"
                      >
                        Belum ada data tabungan untuk tahun {year}
                      </td>
                    </tr>
                  ) : (
                    monthlyData.map((s, i) => {
                      const monthsTotal = Object.values(s.months).reduce(
                        (a, b) => a + b,
                        0,
                      );
                      return (
                        <tr
                          key={s.studentId}
                          className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <td className="px-2 py-2.5 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {i + 1}
                          </td>
                          <td className="px-2 py-2.5 text-sm font-medium text-gray-800 dark:text-slate-100 whitespace-nowrap">
                            {s.name}
                          </td>
                          {Array.from({ length: 12 }, (_, mi) => {
                            const monthKey = String(mi + 1).padStart(2, "0");
                            const val = s.months[monthKey];
                            return (
                              <td
                                key={mi}
                                className="px-2 py-2.5 text-xs md:text-sm text-center font-medium whitespace-nowrap"
                              >
                                {val ? (
                                  <span className="text-emerald-700 dark:text-emerald-300">
                                    {formatCompactRupiah(val)}
                                  </span>
                                ) : (
                                  <span className="text-gray-300 dark:text-gray-600">
                                    -
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-2 py-2.5 text-xs md:text-sm text-center font-semibold text-gray-800 dark:text-slate-100 whitespace-nowrap">
                            {formatCompactRupiah(s.balance)}
                          </td>
                          <td className="px-2 py-2.5 text-center whitespace-nowrap">
                            {s.totalWithdrawn > 0 ? (
                              <button
                                onClick={() => {
                                  closeHistoryModal();
                                  openHistoryModal(
                                    {
                                      studentId: s.studentId,
                                      name: s.name,
                                      grade: s.grade,
                                      balance: s.balance,
                                      todayDeposit: 0,
                                      todayWithdrawal: 0,
                                    },
                                    "tarik",
                                  );
                                }}
                                className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors cursor-pointer text-xs md:text-sm font-semibold underline decoration-dotted underline-offset-2"
                                title="Lihat riwayat penarikan"
                              >
                                {formatCompactRupiah(s.totalWithdrawn)}
                              </button>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600 text-xs md:text-sm">
                                -
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!monthlyLoading && monthlyData.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                Menampilkan total setoran per bulan. Tanda (-) berarti tidak ada
                setoran.
              </p>
            )}
          </div>
        </>
      )}

      {/* Transaction Modal */}
      {txModal.open && txModal.student && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-white/20 dark:border-gray-700/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-slate-100">
                {txModal.mode === "simpan" ? "Simpan" : "Tarik"} Tabungan
              </h3>
              <button
                onClick={closeTxModal}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Siswa</p>
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100">
                  {txModal.student.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Saldo Saat Ini</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                  {formatCompactRupiah(txModal.student.balance)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Jumlah
                </label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="Masukkan jumlah"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {txModal.mode === "simpan"
                    ? "Keterangan (opsional)"
                    : "Catatan penarikan"}
                </label>
                <input
                  type="text"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder={
                    txModal.mode === "simpan"
                      ? "Misal: Tabungan hari Jumat"
                      : "Alasan penarikan (misal: beli buku)"
                  }
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
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModal.open && historyModal.student && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl border border-white/20 dark:border-gray-700/50 p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-slate-100">
                  Riwayat Transaksi
                </h3>
                <p className="text-xs text-gray-500">
                  {historyModal.student.name}
                </p>
              </div>
              <button
                onClick={closeHistoryModal}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                      <th className="px-3 py-2.5 text-left font-semibold">
                        Tanggal
                      </th>
                      <th className="px-3 py-2.5 text-center font-semibold">
                        Tipe
                      </th>
                      <th className="px-3 py-2.5 text-right font-semibold">
                        Jumlah
                      </th>
                      <th className="px-3 py-2.5 text-center font-semibold">
                        Keterangan
                      </th>
                      <th className="px-3 py-2.5 text-center font-semibold">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {historyLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-3 py-2.5">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12 mx-auto" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 ml-auto" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mx-auto" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mx-auto" />
                          </td>
                        </tr>
                      ))
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-8 text-center text-gray-400"
                        >
                          Belum ada transaksi
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr
                          key={tx._id}
                          className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <td className="px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400">
                            <span className="hidden md:inline">{formatDateID(tx.date)}</span>
                            <span className="md:hidden">{formatDateShort(tx.date)}</span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                tx.type === "simpan"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                  : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                              }`}
                            >
                              {tx.type === "simpan" ? "Simpan" : "Tarik"}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-sm text-right font-medium text-gray-800 dark:text-slate-100">
                            {formatCompactRupiah(tx.amount)}
                          </td>
                          <td
                            className="px-3 py-2.5 text-sm text-center text-gray-500 dark:text-gray-400 max-w-[150px] truncate"
                            title={tx.description || ""}
                          >
                            {tx.description || "-"}
                          </td>
                          <td className="px-3 py-2.5 text-center">
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editModal.open && editModal.transaction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-white/20 dark:border-gray-700/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-slate-100">
                Edit Transaksi
              </h3>
              <button
                onClick={closeEditModal}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Tipe</p>
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100 uppercase">
                  {editModal.transaction.type}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Jumlah
                </label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Tanggal
                </label>
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
                  {editModal.transaction.type === "tarik" ? (
                    <span className="text-rose-500">*</span>
                  ) : (
                    "(opsional)"
                  )}
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder={
                    editModal.transaction.type === "tarik"
                      ? "Alasan penarikan (wajib)"
                      : "Misal: Beli buku"
                  }
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
                {editSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm border border-white/20 dark:border-gray-700/50 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">
              Hapus Transaksi
            </h3>
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
                disabled={deletingId === confirmDelete.txId}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deletingId === confirmDelete.txId ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
