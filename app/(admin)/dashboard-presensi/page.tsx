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
import FilterBar from "@/app/components/shared/FilterBar";
import ExportWordButton from "@/app/components/ExportWordButton";

import { MonthlyPresensiView } from "./components/MonthlyPresensiView";
import { DailyPresensiView } from "./components/DailyPresensiView";
import { DistribusiStatus } from "./components/DistribusiStatus";
import { PresensiStatCards } from "./components/PresensiStatCards";

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
      className={`flex-1 flex justify-center items-center gap-2 h-full rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
        mode === m
          ? "bg-indigo-600 text-white shadow"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
  return (
    <div className="flex w-full h-[42px] items-center gap-1 p-1 bg-slate-100 dark:bg-gray-800/80 rounded-xl border border-slate-300 dark:border-gray-700 shadow-inner">
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
      <FilterBar
        config={{
          showGrade: true,
          showMonth: !isHarian,
          showYear: !isHarian,
        }}
        grade={grade}
        onGradeChange={(v) => { if (v !== null) setGrade(v); }}
        gradeDisabled={userRole === "guru"}
        month={String(month)}
        onMonthChange={(v) => { if (v !== null) setMonth(Number(v)); }}
        months={MONTHS_ID}
        year={String(year)}
        onYearChange={(v) => { if (v !== null) setYear(Number(v)); }}
        gridClassName={isHarian ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}
      >
        {isHarian && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">
              Tanggal
            </label>
            <DateDayPicker
              value={selectedDate}
              onChange={setSelectedDate}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        )}
        <div className="flex flex-col justify-end">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">
            Mode Tampilan
          </label>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </FilterBar>

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
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <Link
              href="/rekap-presensi"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
            >
              Lihat Rekap Lengkap
              <ArrowRight size={16} />
            </Link>
            
            {!isHarian && userRole === "guru" && (
              <ExportWordButton grade={grade} month={month} year={year} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
