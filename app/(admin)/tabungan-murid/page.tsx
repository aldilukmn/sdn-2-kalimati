"use client";

import { useEffect } from "react";
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
} from "lucide-react";
import { useStudentSavings, GRADES } from "@/hooks/useStudentSavings";
import Pagination from "@/app/components/Pagination";
import DateDayPicker from "@/app/components/DateDayPicker";
import toast from "react-hot-toast";

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
    handleEditTransaction,
    handleDeleteTransaction,
    fetchHistoryPage,
    formatRupiah,
    students,
    exportExcel,
  } = useStudentSavings();

  useEffect(() => {
    if (message) {
      if (message.type === "success") {
        toast.success(message.text);
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
              Kelola simpanan siswa per kelas
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              Kelas
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <p className="text-[13px] text-center md:text-base text-gray-500 dark:text-gray-400">
            Siswa Menabung
          </p>
          <p className="text-lg md:text-3xl font-bold text-center mt-1 text-violet-700 dark:text-violet-300">
            {summaryLoading ? "..." : `${summary?.totalStudents || 0} siswa`}
          </p>
        </div>
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <p className="text-[13px] text-center md:text-base text-gray-500 dark:text-gray-400">
            Setoran
          </p>
          <p className="text-lg md:text-3xl font-bold text-center mt-1 text-emerald-700 dark:text-emerald-300">
            {summaryLoading
              ? "..."
              : formatRupiah(summary?.dailyDeposits || 0)}
          </p>
        </div>
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <p className="text-[13px] text-center md:text-base text-gray-500 dark:text-gray-400">
            Penarikan
          </p>
          <p className="text-lg md:text-3xl font-bold text-center mt-1 text-orange-700 dark:text-orange-300">
            {summaryLoading
              ? "..."
              : formatRupiah(summary?.dailyWithdrawals || 0)}
          </p>
        </div>
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <p className="text-[13px] text-center md:text-base text-gray-500 dark:text-gray-400">
            Selisih
          </p>
          <p className={`text-lg md:text-3xl font-bold text-center mt-1 ${
            summaryLoading
              ? ""
              : (summary?.dailyDeposits || 0) - (summary?.dailyWithdrawals || 0) >= 0
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-red-600 dark:text-red-400"
          }`}>
            {summaryLoading
              ? "..."
              : formatRupiah((summary?.dailyDeposits || 0) - (summary?.dailyWithdrawals || 0))}
          </p>
        </div>
      </div>

      {/* Export + Table */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
            Daftar Tabungan Siswa
          </h2>
          <button
            onClick={exportExcel}
            disabled={loading || students.length === 0}
          >
            <FileDown size={18} />
            Export Excel
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                <th className="px-3 py-3 text-left font-semibold">No</th>
                <th className="px-3 py-3 text-left font-semibold">Nama</th>
                <th className="px-3 py-3 text-center font-semibold">Saldo</th>
                <th className="px-3 py-3 text-center font-semibold">Setoran</th>
                <th className="px-3 py-3 text-center font-semibold">Penarikan</th>
                <th className="px-3 py-3 text-center font-semibold">Aksi</th>
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
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
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
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {startIndex + i + 1}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-800 dark:text-slate-100">
                      {s.name}
                    </td>
                    <td className="px-3 py-3 text-sm text-center font-semibold text-gray-800 dark:text-slate-100">
                      {formatRupiah(s.balance)}
                    </td>
                    <td className="px-3 py-3 text-sm text-center text-emerald-700 dark:text-emerald-300 font-medium">
                      {s.todayDeposit ? formatRupiah(s.todayDeposit) : "-"}
                    </td>
                    <td className="px-3 py-3 text-sm text-center text-orange-600 dark:text-orange-400 font-medium">
                      {s.todayWithdrawal ? formatRupiah(s.todayWithdrawal) : "-"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openTxModal(s, "simpan")}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                          Simpan
                        </button>
                        <button
                          onClick={() => openTxModal(s, "tarik")}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                          Tarik
                        </button>
                        <button
                          onClick={() => openHistoryModal(s)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer"
                        >
                          <History size={14} />
                          Riwayat
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
                  {formatRupiah(txModal.student.balance)}
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
                  Keterangan (opsional)
                </label>
                <input
                  type="text"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder="Misal: Tabungan hari Jumat"
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
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mx-auto" />
                          </td>
                        </tr>
                      ))
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td
                    colSpan={5}
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
                            {tx.date}
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
                            {formatRupiah(tx.amount)}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditTransaction(tx)}
                                disabled={editingTx === tx._id}
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
    </div>
  );
}
