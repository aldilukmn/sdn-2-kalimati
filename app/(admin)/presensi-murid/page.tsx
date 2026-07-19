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
import DateDayPicker from "@/components/common/DateDayPicker";
import PresensiStatusBadge from "@/components/common/PresensiStatusBadge";
import PresensiTable from "@/components/tables/PresensiTable";
import { usePresensi } from "@/hooks/usePresensi";
import { GRADES } from "@/lib/constants";
import toast from "react-hot-toast";
import HolidayService from "@/services/holiday.service";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/modals/Modal"), { ssr: false });
import PageHero from "@/components/layout/PageHero";
import HolidayInfoCard from "@/components/common/HolidayInfoCard";
import FilterBar from "@/components/shared/FilterBar";
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
  const [newDateStart, setNewDateStart] = useState("");
  const [newDateEnd, setNewDateEnd] = useState("");
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
    if (!newDateStart || !newDesc.trim()) return;
    setAddSaving(true);
    try {
      const start = new Date(newDateStart);
      const end = newDateEnd ? new Date(newDateEnd) : start;
      if (end < start) {
        toast.error("Tanggal akhir tidak boleh sebelum tanggal mulai");
        setAddSaving(false);
        return;
      }
      
      const promises = [];
      const current = new Date(start);
      while (current <= end) {
        // hindari hari minggu karena otomatis libur
        if (current.getDay() !== 0) {
          const dStr = current.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
          promises.push(HolidayService.add({ date: dStr, description: newDesc.trim() }));
        }
        current.setDate(current.getDate() + 1);
      }
      
      if (promises.length > 0) {
        await Promise.all(promises);
        await refreshHolidays();
        setNewDateStart("");
        setNewDateEnd("");
        setNewDesc("");
        toast.success("Hari libur berhasil ditambahkan");
        setManageOpen(false);
      } else {
        toast.error("Tidak ada hari kerja yang bisa ditambahkan sebagai libur (hanya Minggu)");
      }
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
      <PageHero icon={CalendarCheck} title="Presensi Murid Harian" description="Input kehadiran murid per kelas" />

      {/* Filter */}
      <FilterBar
        config={{ showGrade: true }}
        grade={grade}
        onGradeChange={(v) => { if (v !== null) setGrade(v); }}
        gradeDisabled={userRole !== "admin" && userRole !== "kepala"}
        className="relative z-10"
        gridClassName="grid-cols-1 md:grid-cols-2"
      >
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
                className="shrink-0 h-[42px] px-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
                title="Atur Hari Libur"
              >
                Atur Libur
              </button>
            )}
          </div>
        </div>
      </FilterBar>

      {/* Holiday banner */}

      {isHoliday ? (
        <HolidayInfoCard
          currentHoliday={currentHoliday}
          message="Tidak bisa mencatat presensi pada hari libur."
        />
      ) : (
        <>
          {/* Status summary */}
          <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 ">
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
            {/* Add Holiday Section */}
            <div className="mb-5 p-4 bg-slate-50 dark:bg-gray-900/50 rounded-xl border border-slate-200 dark:border-gray-800">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Tambah Libur Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-500 mb-1 ml-1">Dari Tanggal</label>
                  <DateDayPicker value={newDateStart} onChange={setNewDateStart} />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-500 mb-1 ml-1">Sampai (Opsional)</label>
                  <DateDayPicker value={newDateEnd} onChange={setNewDateEnd} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex flex-col flex-1 w-full">
                  <label className="text-[10px] text-gray-500 mb-1 ml-1">Keterangan Libur</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Contoh: Hari Raya Idul Fitri"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 placeholder:text-xs md:placeholder:text-sm h-[42px] w-full"
                  />
                </div>
                <button
                  onClick={handleAddHoliday}
                  disabled={addSaving || !newDateStart || !newDesc.trim()}
                  className="w-full sm:w-auto h-[42px] flex items-center justify-center gap-1.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  {addSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  Simpan
                </button>
              </div>
            </div>

            {/* List Holidays Section */}
            <div className="flex items-center justify-between mb-3 mt-2 px-1">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Daftar Libur Tersimpan</h4>
              <div>
                <Select
                  value={holidayMonth ?? ""}
                  onValueChange={(v) => {
                    if (!v) return;
                    setHolidayMonth(v);
                    setHolidayPage(1);
                  }}
                >
                  <SelectTrigger className="h-[36px] rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs md:text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                    <SelectValue
                      placeholder="Pilih bulan"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-xs">Bulan</SelectLabel>
                      {MONTHS_ID.map((name, i) => (
                        <SelectItem key={i + 1} value={name} className="text-xs">
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-800">
              <Table className="min-w-[450px]">
                <TableHeader>
                  <TableRow className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">
                    <TableHead className="w-[100px] md:w-[130px]">
                      Tanggal
                    </TableHead>
                    <TableHead className="border-x border-slate-200 dark:border-gray-700 px-3">
                      Keterangan
                    </TableHead>
                    <TableHead className="w-[50px] text-center">Aksi</TableHead>
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
                        <TableCell className="border-x border-slate-200 dark:border-gray-700 text-gray-800 dark:text-slate-100 px-3 py-2 text-xs md:text-sm leading-relaxed">
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
