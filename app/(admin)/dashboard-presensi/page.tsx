"use client";

import Link from "next/link";
import {
  CalendarCheck,
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardPresensi, type ViewMode } from "@/hooks/useDashboardPresensi";
import { GRADES, AVAILABLE_YEARS } from "@/lib/constants";
import { MONTHS_ID } from "@/lib/format";
import PageHero from "@/app/components/PageHero";
import LoadingSkeleton from "@/app/components/shared/LoadingSkeleton";
import DateDayPicker from "@/app/components/DateDayPicker";

import { MonthlyPresensiView } from "./components/MonthlyPresensiView";
import { DailyPresensiView } from "./components/DailyPresensiView";
import { DistribusiStatus } from "./components/DistribusiStatus";
import { PresensiStatCards } from "./components/PresensiStatCards";

// ── toggle mode ──────────────────────────────────────────────────────────────
function ViewToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  const btn = (m: ViewMode, label: string, Icon: React.ElementType) => (
    <button
      key={m}
      onClick={() => onChange(m)}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
        mode === m
          ? "bg-indigo-600 text-white shadow"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
      {btn("harian", "Harian", CalendarDays)}
      {btn("bulanan", "Bulanan", Calendar)}
    </div>
  );
}

export default function DashboardPresensiPage() {
  const { role: userRole, grade: userGrade } = useAuth();

  const {
    viewMode,
    setViewMode,
    grade,
    setGrade,
    month,
    setMonth,
    year,
    setYear,
    selectedDate,
    setSelectedDate,
    trendYear,
    setTrendYear,
    summary,
    gradeRows,
    topAbsen,
    topLowHadir,
    totalStudents,
    avgHadirPerSiswa,
    loading,
    initialLoading,
    error,
    retry,
    hasData,
  } = useDashboardPresensi(userRole, userGrade);

  const isAdminOrKepala = userRole === "admin" || userRole === "kepala";
  const isHarian = viewMode === "harian";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={CalendarCheck}
        title="Dashboard Presensi"
        description="Ringkasan kehadiran siswa per kelas"
      />

      {/* ── Filter ─────────────────────────────────────────────────────── */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        {/* Toggle mode */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Mode Tampilan
          </span>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>

        <div className={`grid grid-cols-1 gap-4 ${isHarian ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'}`}>
          {/* Kelas */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Kelas
            </label>
            <Select
              value={grade}
              onValueChange={(v) => v && setGrade(v)}
              disabled={userRole === "guru"}
            >
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kelas</SelectLabel>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      Kelas {g}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {isHarian ? (
            /* Mode Harian: pilih tanggal */
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Tanggal
              </label>
              <DateDayPicker
                value={selectedDate}
                onChange={setSelectedDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          ) : (
            /* Mode Bulanan: pilih bulan + tahun */
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Bulan
                </label>
                <Select
                  value={String(month)}
                  onValueChange={(v) => v && setMonth(Number(v))}
                >
                  <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                    <SelectValue placeholder="Bulan" className="sr-only" />
                    {MONTHS_ID[month - 1]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bulan</SelectLabel>
                      {MONTHS_ID.map((name, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Tahun
                </label>
                <Select
                  value={String(year)}
                  onValueChange={(v) => v && setYear(Number(v))}
                >
                  <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tahun</SelectLabel>
                      {AVAILABLE_YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      {error ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle
              size={40}
              className="mx-auto text-red-300 dark:text-red-600 mb-3"
            />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button
              onClick={retry}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : initialLoading ? (
        <LoadingSkeleton rows={1} />
      ) : !hasData ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <CalendarCheck
              size={40}
              className="mx-auto text-slate-300 dark:text-slate-600 mb-3"
            />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {isHarian
                ? "Belum ada data presensi untuk tanggal ini."
                : "Belum ada data presensi untuk periode ini."}
            </p>
            <Link
              href="/presensi-murid"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Input Presensi
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <PresensiStatCards
            summary={summary}
            loading={loading}
            isHarian={isHarian}
            totalStudents={totalStudents}
            avgHadirPerSiswa={avgHadirPerSiswa}
          />

          <DistribusiStatus
            isHarian={isHarian}
            totalStudents={totalStudents}
            loading={loading}
            summary={summary}
          />

          {!isHarian ? (
            <MonthlyPresensiView
              trendYear={trendYear}
              setTrendYear={setTrendYear}
              grade={grade}
              isAdminOrKepala={isAdminOrKepala}
              gradeRows={gradeRows}
              loading={loading}
              topAbsen={topAbsen}
              topLowHadir={topLowHadir}
            />
          ) : (
            <DailyPresensiView topAbsen={topAbsen} />
          )}

          {/* Footer link */}
          <div className="text-center">
            <Link
              href="/rekap-presensi"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              Lihat Rekap Lengkap
              <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
