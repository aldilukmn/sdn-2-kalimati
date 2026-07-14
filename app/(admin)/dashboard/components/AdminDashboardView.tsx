"use client";

import Link from "next/link";
import { LayoutDashboard, TrendingUp, ArrowRight, TrendingDown, Minus } from "lucide-react";
import { useDashboard, type DashboardSummary } from "@/hooks/useDashboard";
import DashboardStatCards from "@/app/components/DashboardStatCards";
import InsightCards from "@/app/components/InsightCards";
import PageHero from "@/app/components/PageHero";
import TabunganSection from "./TabunganSection";

export default function AdminDashboardView({
  initialSummary,
  initialMonth,
  initialYear,
  userRole,
}: {
  initialSummary?: DashboardSummary | null;
  initialMonth?: number;
  initialYear?: number;
  userRole?: string | null;
}) {
  const {
    month,
    year,
    loading,
    chartLoading,
    error,
    summary,
    attendanceDelta,
  } = useDashboard(initialSummary, initialMonth, initialYear);

  // Hitung % kehadiran bulan ini
  const abs = summary?.attendanceByStatus;
  const totalAbsEntries = abs
    ? abs.hadir + abs.sakit + abs.izin + abs.absen
    : 0;
  const hadirRate =
    totalAbsEntries > 0 ? Math.round((abs!.hadir / totalAbsEntries) * 100) : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHero
        icon={LayoutDashboard}
        title="Dashboard Admin"
        description="Ringkasan data pendaftar, guru, dan kehadiran siswa"
      />

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
          {error}
        </div>
      )}
      <DashboardStatCards summary={summary} loading={loading} />

      <TabunganSection userRole={userRole} />

      <InsightCards
        attendanceByGrade={summary?.attendanceByGrade || null}
        loading={chartLoading}
      />

      {/* Kehadiran — Card Ringkas */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Kiri: label + angka */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Tingkat Kehadiran Bulan Ini
              </p>
              {chartLoading ? (
                <div className="h-7 w-20 mt-1 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              ) : hadirRate !== null ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-2xl font-bold ${
                    hadirRate >= 90
                      ? "text-emerald-600 dark:text-emerald-400"
                      : hadirRate >= 75
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-500 dark:text-red-400"
                  }`}>
                    {hadirRate}%
                  </span>
                  {attendanceDelta !== null && (
                    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                      attendanceDelta > 0
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : attendanceDelta < 0
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}>
                      {attendanceDelta > 0 ? (
                        <TrendingUp size={10} />
                      ) : attendanceDelta < 0 ? (
                        <TrendingDown size={10} />
                      ) : (
                        <Minus size={10} />
                      )}
                      {attendanceDelta > 0 ? "+" : ""}{attendanceDelta}% vs bln lalu
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Belum ada data</p>
              )}
            </div>
          </div>

          {/* Kanan: tombol */}
          <Link
            href={`/dashboard-presensi`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shrink-0"
          >
            Lihat Detail
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
