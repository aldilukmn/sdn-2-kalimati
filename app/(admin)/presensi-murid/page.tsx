"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, CalendarCheck, Trash2, Plus, X } from "lucide-react";
import DateDayPicker from "@/app/components/DateDayPicker";
import PresensiStatusBadge from "@/app/components/PresensiStatusBadge";
import PresensiTable from "@/app/components/PresensiTable";
import { usePresensi, GRADES } from "@/hooks/usePresensi";
import toast from "react-hot-toast";
import HolidayService from "@/services/holiday.service";
import { formatDateID } from "@/lib/format";

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
    holidays,
    isHoliday,
    holidayList,
    refreshHolidays,
  } = usePresensi();

  const [manageOpen, setManageOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [removingDate, setRemovingDate] = useState<string | null>(null);

  const handleAddHoliday = async () => {
    if (!newDate || !newDesc.trim()) return;
    setAddSaving(true);
    try {
      await HolidayService.add({ date: newDate, description: newDesc.trim() });
      await refreshHolidays();
      setNewDate("");
      setNewDesc("");
    } catch (e: any) {
      toast.error(e.message || "Gagal menambah hari libur");
    } finally {
      setAddSaving(false);
    }
  };

  const handleRemoveHoliday = async (date: string) => {
    setRemovingDate(date);
    try {
      await HolidayService.remove(date);
      await refreshHolidays();
    } catch (e: any) {
      toast.error(e.message || "Gagal menghapus hari libur");
    } finally {
      setRemovingDate(null);
    }
  };

  useEffect(() => {
    if (message) {
      if (message.type === "success") {
        toast.success(message.text);
      } else {
        toast.error(message.text);
      }
    }
  }, [message]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl ">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative p-5 md:p-6 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/15 rounded-xl flex items-center justify-center animate-iconBounce">
            <CalendarCheck size={26} className="md:size-[30px] text-white" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
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

        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 z-10">
          <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
            Tanggal
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <DateDayPicker
                value={date}
                onChange={setDate}
                max={new Date().toISOString().slice(0, 10)}
                blockedDates={holidays}
              />
            </div>
            {(userRole === "admin" || userRole === "kepala") && (
              <button
                onClick={() => setManageOpen(true)}
                className="shrink-0 h-10 px-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
                title="Atur Hari Libur"
              >
                Atur Libur
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Holiday banner */}
      {isHoliday && (
        <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 shadow-lg rounded-2xl p-4 md:p-5 text-center">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            Hari Libur — Tidak bisa mencatat presensi pada tanggal ini
          </p>
        </div>
      )}

      {/* Status summary */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 ">
        <PresensiStatusBadge
          loading={loadingSiswa || syncing}
          countByStatus={countByStatus}
        />
      </div>

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
        saveButton={
          entries.length > 0 ? (
            <button
              onClick={handleSave}
              disabled={saving || isHoliday}
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
          ) : undefined
        }
      />

      {/* Holiday Management Modal */}
      {manageOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg border border-white/20 dark:border-gray-700/50 p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-slate-100">
                Kelola Hari Libur
              </h3>
              <button
                onClick={() => setManageOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Deskripsi"
                className="flex-[2] rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
              />
              <button
                onClick={handleAddHoliday}
                disabled={addSaving || !newDate || !newDesc.trim()}
                className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {addSaving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Tambah
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              {holidayList.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Belum ada hari libur
                </p>
              ) : (
                holidayList.map((h) => (
                  <div
                    key={h.date}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-28">
                        {formatDateID(h.date)}
                      </span>
                      <span className="text-sm text-gray-800 dark:text-slate-100">
                        {h.description}
                      </span>
                      {h.type === "sunday" && (
                        <span className="text-[10px] text-blue-500 dark:text-blue-400 font-medium uppercase">
                          Minggu
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveHoliday(h.date)}
                      disabled={removingDate === h.date}
                      className="p-1 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-40 cursor-pointer"
                      title="Hapus"
                    >
                      {removingDate === h.date ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
