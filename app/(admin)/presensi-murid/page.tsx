"use client";

import { Loader2, Save, GraduationCap } from "lucide-react";
import DateDayPicker from "@/app/components/DateDayPicker";
import PresensiStatusBadge from "@/app/components/PresensiStatusBadge";
import PresensiTable from "@/app/components/PresensiTable";
import Toast from "@/app/components/Toast";
import { usePresensi, GRADES } from "@/hooks/usePresensi";

export default function PresensiMuridPage() {
  const {
    grade,
    setGrade,
    userRole,
    date,
    setDate,
    entries,
    saving,
    message,
    isExisting,
    loadingSiswa,
    syncing,
    teacherName,
    teacherLoading,
    currentPage,
    setCurrentPage,
    handleStatusChange,
    handleSave,
    countByStatus,
    clearMessage,
    totalPages,
    startIndex,
    paginatedEntries,
    itemsPerPage,
  } = usePresensi();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative p-5 md:p-6 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center animate-iconBounce">
            <GraduationCap size={26} className="md:size-[30px] text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg md:text-xl font-bold">
              Presensi Murid Harian
            </h1>
            <p className="text-indigo-200/80 text-xs md:text-sm mt-0.5">
              Input kehadiran siswa per kelas
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Kelas
          </label>
          {userRole !== "admin" && userRole !== "kepala" ? (
            <div className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-800 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
              Kelas {grade}
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

        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tanggal
          </label>
          <DateDayPicker
            value={date}
            onChange={setDate}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>

      {/* Status summary */}
      <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <PresensiStatusBadge
          loading={loadingSiswa || syncing}
          countByStatus={countByStatus}
        />
      </div>

      {/* Toast */}
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={clearMessage}
        />
      )}

      {/* Table */}
      <PresensiTable
        paginatedEntries={paginatedEntries}
        startIndex={startIndex}
        syncing={syncing}
        totalPages={totalPages}
        totalItems={entries.length}
        currentPage={currentPage}
        loading={loadingSiswa}
        onPageChange={setCurrentPage}
        onStatusChange={handleStatusChange}
      />

      {/* Save */}
      {entries.length > 0 && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving
            ? "Menyimpan..."
            : isExisting
              ? "Perbarui Presensi"
              : "Simpan Presensi"}
        </button>
      )}
    </div>
  );
}
