"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  CalendarCheck,
  CalendarX,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import DateDayPicker from "@/app/components/DateDayPicker";
import PresensiStatusBadge from "@/app/components/PresensiStatusBadge";
import PresensiTable from "@/app/components/PresensiTable";
import { usePresensi, GRADES } from "@/hooks/usePresensi";
import toast from "react-hot-toast";
import HolidayService from "@/services/holiday.service";
import { formatDateID, formatDateShort, MONTHS_ID } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const currentHoliday = holidayList.find((h) => h.date === date);
  const [manageOpen, setManageOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [removingDate, setRemovingDate] = useState<string | null>(null);
  const [holidayPage, setHolidayPage] = useState(1);
  const [holidayMonth, setHolidayMonth] = useState<string | null>(null);
  const HOLIDAY_PER_PAGE = 5;
  const filteredHolidays = holidayList.filter((h) => {
    if (h.type === "sunday") return false;
    if (holidayMonth === null) return false;
    const m = parseInt(h.date.split("-")[1]);
    return MONTHS_ID[m - 1] === holidayMonth;
  });
  const holidayTotalPages = Math.ceil(
    filteredHolidays.length / HOLIDAY_PER_PAGE,
  );
  const paginatedHolidays = filteredHolidays.slice(
    (holidayPage - 1) * HOLIDAY_PER_PAGE,
    holidayPage * HOLIDAY_PER_PAGE,
  );

  const handleAddHoliday = async () => {
    if (!newDate || !newDesc.trim()) return;
    setAddSaving(true);
    try {
      await HolidayService.add({ date: newDate, description: newDesc.trim() });
      await refreshHolidays();
      setNewDate("");
      setNewDesc("");
      toast.success("Hari libur berhasil ditambahkan");
      setManageOpen(false);
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
      toast.success("Hari libur berhasil dihapus");
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

  useEffect(() => {
    setHolidayPage(1);
  }, [holidayList]);

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
              {grade}
            </div>
          ) : (
            <Select
              value={grade}
              onValueChange={(v) => {
                if (v !== null) setGrade(v);
              }}
            >
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kelas</SelectLabel>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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

      {isHoliday ? (
        /* Holiday info card */
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-6 md:p-8 text-center animate-fadeIn">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <CalendarX
              size={32}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>
          {currentHoliday && (
            <>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-1">
                {formatDateID(currentHoliday.date)}
              </p>
              <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-1">
                {currentHoliday.description}
              </h3>
              <span
                className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-4 ${
                  currentHoliday.type === "sunday"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                }`}
              >
                {currentHoliday.type === "sunday"
                  ? "Hari Minggu"
                  : "Libur Nasional"}
              </span>
            </>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tidak bisa mencatat presensi pada hari libur.
          </p>
          {(userRole === "admin" || userRole === "kepala") && (
            <button
              onClick={() => setManageOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              Kelola Hari Libur
            </button>
          )}
        </div>
      ) : (
        <>
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
        </>
      )}

      {/* Holiday Management Modal */}
      {manageOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg border border-white/20 dark:border-gray-700/50 p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm md:text-base">
                Kelola Hari Libur
              </h3>
              <button
                onClick={() => setManageOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <Select
                value={holidayMonth ?? ""}
                onValueChange={(v) => {
                  if (!v) return;
                  setHolidayMonth(v);
                  setHolidayPage(1);
                }}
              >
                <SelectTrigger className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                  <SelectValue
                    placeholder="Pilih bulan"
                    className="text-xs md:text-sm tracking-widest"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bulan</SelectLabel>
                    {MONTHS_ID.map((name, i) => (
                      <SelectItem key={i + 1} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <DateDayPicker value={newDate} onChange={setNewDate} />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Deskripsi"
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 placeholder:text-xs md:placeholder:text-sm"
              />
              <button
                onClick={handleAddHoliday}
                disabled={addSaving || !newDate || !newDesc.trim()}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {addSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                Tambah
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-xs font-mono text-gray-400 dark:text-gray-500 tracking-wider border-b border-slate-200 dark:border-gray-700">
                    <th className="px-3 py-1.5 text-left w-[80px] md:w-[120px]">
                      Tanggal
                    </th>
                    <th className="px-3 py-1.5 border-x border-slate-200 dark:border-gray-700">
                      Keterangan
                    </th>
                    <th className="px-3 py-1.5 w-[36px]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHolidays.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-sm text-gray-400 text-center py-8"
                      >
                        {holidayMonth === null
                          ? "Pilih bulan untuk menampilkan data"
                          : holidayList.length === 0
                          ? "Belum ada hari libur"
                          : "Tidak ada hari libur di bulan ini"}
                      </td>
                    </tr>
                  ) : (
                    paginatedHolidays.map((h) => (
                      <tr
                        key={h.date}
                        className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800 text-xs md:text-sm"
                      >
                        <td className="px-3 py-2 font-mono text-gray-600 dark:text-gray-400 truncate">
                          <span className="hidden md:inline">
                            {formatDateID(h.date)}
                          </span>
                          <span className="md:hidden">
                            {formatDateShort(h.date)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-800 dark:text-slate-100 border-x border-slate-200 dark:border-gray-700 truncate">
                          {h.description}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleRemoveHoliday(h.date)}
                            disabled={removingDate === h.date}
                            className="mx-auto p-1 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-40 cursor-pointer"
                            title="Hapus"
                          >
                            {removingDate === h.date ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {holidayTotalPages > 1 && (
              <div className="flex items-center justify-between mt-5">
                <p className="text-xs text-gray-500">
                  Halaman {holidayPage} dari {holidayTotalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHolidayPage((p) => Math.max(1, p - 1))}
                    disabled={holidayPage <= 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs text-gray-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() =>
                      setHolidayPage((p) => Math.min(holidayTotalPages, p + 1))
                    }
                    disabled={holidayPage >= holidayTotalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs text-gray-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
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
