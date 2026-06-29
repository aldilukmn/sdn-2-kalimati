"use client";

import { Card } from "flowbite-react";
import {
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import TableSkeleton from "@/app/components/TableSkeleton";
import DateDayPicker from "@/app/components/DateDayPicker";
import PresensiStatusBadge from "@/app/components/PresensiStatusBadge";
import PresensiTable from "@/app/components/PresensiTable";
import {
  usePresensi,
  GRADES,
} from "@/hooks/usePresensi";

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
    totalPages,
    startIndex,
    paginatedEntries,
    itemsPerPage,
  } = usePresensi();

  return (
    <div className="flex flex-col items-center justify-start gap-6 px-4 py-7 xl:py-10">
      <Card className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <div className="text-4xl md:text-5xl mb-3">📋</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Presensi Murid Harian
          </h1>
          <p className="text-sm opacity-70 text-gray-600 dark:text-gray-300 mt-1">
            Input kehadiran siswa per kelas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tanggal
            </label>
            <DateDayPicker
              value={date}
              onChange={setDate}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>

        <>
          {message && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              {message.text}
            </div>
          )}

          <div className="grid lg:grid-cols-2 sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex-shrink-0">
              {teacherLoading ? (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  👤 Guru:{" "}
                  <span className="inline-block h-3 w-24 bg-purple-300 dark:bg-purple-600 rounded animate-pulse align-middle" />
                </span>
              ) : teacherName ? (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  👤 Guru: {teacherName}
                </span>
              ) : null}
            </div>
            <PresensiStatusBadge
              loading={loadingSiswa || syncing}
              countByStatus={countByStatus}
            />
          </div>

          {loadingSiswa ? (
            <TableSkeleton
              headers={["No", "Nama Siswa", "Student ID", "Status Kehadiran"]}
              rows={5}
            >
              {() => (
                <>
                  <td className="px-4 py-3">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                  </td>
                </>
              )}
            </TableSkeleton>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Tidak ada siswa di kelas ini
            </div>
          ) : (
            <>
              <PresensiTable
                paginatedEntries={paginatedEntries}
                startIndex={startIndex}
                syncing={syncing}
                totalPages={totalPages}
                totalItems={entries.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onStatusChange={handleStatusChange}
              />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || entries.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
              </div>
            </>
          )}
        </>
      </Card>
    </div>
  );
}
