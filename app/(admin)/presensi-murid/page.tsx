"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  CalendarCheck,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import DateDayPicker from "@/app/components/DateDayPicker";
import PresensiStatusBadge from "@/app/components/PresensiStatusBadge";
import PresensiTable from "@/app/components/PresensiTable";
import { usePresensi } from "@/hooks/usePresensi";
import { GRADES } from "@/lib/constants";
import toast from "react-hot-toast";
import HolidayService from "@/services/holiday.service";
import Modal from "@/app/components/Modal";
import PageHero from "@/app/components/PageHero";
import HolidayInfoCard from "@/app/components/HolidayInfoCard";
import { formatDateID, formatDateShort, MONTHS_ID, getTodayLocal } from "@/lib/format";
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
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menambah hari libur");
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
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus hari libur");
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
      <PageHero icon={CalendarCheck} title="Presensi Murid Harian" description="Input kehadiran siswa per kelas" />

      {/* Filter */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Kelas</label>
            <Select
              value={grade}
              onValueChange={(v) => { if (v !== null) setGrade(v); }}
              disabled={userRole !== "admin" && userRole !== "kepala"}
            >
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kelas</SelectLabel>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              Tanggal
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <DateDayPicker
                  value={date}
                  onChange={setDate}
                  max={getTodayLocal()}
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
      </div>

      {/* Holiday banner */}

      {isHoliday ? (
        <HolidayInfoCard
          currentHoliday={currentHoliday}
          message="Tidak bisa mencatat presensi pada hari libur."
        />
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
        <Modal open onClose={() => setManageOpen(false)} title="Kelola Hari Libur" className="max-w-lg max-h-[80vh] flex flex-col">

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
              <Table>
                <TableHeader>
                  <TableRow className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">
                    <TableHead className="w-[80px] md:w-[120px]">
                      Tanggal
                    </TableHead>
                    <TableHead className="border-x border-slate-200 dark:border-gray-700">
                      Keterangan
                    </TableHead>
                    <TableHead className="w-[36px] text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHolidays.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-8 text-gray-400"
                      >
                        {holidayMonth === null
                          ? "Pilih bulan untuk menampilkan data"
                          : holidayList.length === 0
                          ? "Belum ada hari libur"
                          : "Tidak ada hari libur di bulan ini"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedHolidays.map((h) => (
                      <TableRow key={h.date}>
                        <TableCell className="font-mono text-gray-600 dark:text-gray-400 truncate">
                          <span className="hidden md:inline">
                            {formatDateID(h.date)}
                          </span>
                          <span className="md:hidden">
                            {formatDateShort(h.date)}
                          </span>
                        </TableCell>
                        <TableCell className="border-x border-slate-200 dark:border-gray-700 text-gray-800 dark:text-slate-100 truncate">
                          {h.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleRemoveHoliday(h.date)}
                            disabled={removingDate === h.date}
                            className="mx-auto p-1 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            title="Hapus"
                          >
                            {removingDate === h.date ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
        </Modal>
      )}
    </div>
  );
}
