"use client";

import { LayoutDashboard, CalendarCheck } from "lucide-react";
import { useDashboard, type DashboardSummary } from "@/hooks/useDashboard";
import DashboardStatCards from "@/app/components/DashboardStatCards";
import AttendanceDonutChart from "@/app/components/AttendanceDonutChart";
import AttendanceBarChart from "@/app/components/AttendanceBarChart";
import AttendanceTrendChart from "@/app/components/AttendanceTrendChart";
import InsightCards from "@/app/components/InsightCards";
import PageHero from "@/app/components/PageHero";
import TabunganSection from "./TabunganSection";
import MonthYearFilter from "@/app/components/shared/MonthYearFilter";

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
    setMonth,
    year,
    setYear,
    loading,
    chartLoading,
    error,
    summary,
    donutData,
    attendanceDelta,
  } = useDashboard(initialSummary, initialMonth, initialYear);

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

      {/* Rekapitulasi Kehadiran — satu card */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex flex-1 items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center shrink-0">
              <CalendarCheck
                size={16}
                className="text-indigo-600 dark:text-indigo-300"
              />
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Rekapitulasi Kehadiran
            </h3>
          </div>
          <MonthYearFilter
            month={month}
            onMonthChange={setMonth}
            year={year}
            onYearChange={setYear}
            variant="dashboard"
            className="flex-1"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-2">
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                Distribusi Kehadiran
              </p>
              {attendanceDelta !== null && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                    attendanceDelta >= 0
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {attendanceDelta >= 0 ? "▲" : "▼"} {Math.abs(attendanceDelta)}
                  %
                </span>
              )}
            </div>
            <AttendanceDonutChart
              data={donutData}
              loading={chartLoading}
              totalDays={summary?.totalDays}
            />
          </div>
          <div className="bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30">
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Kehadiran per Kelas
            </p>
            <AttendanceBarChart
              data={summary?.attendanceByGrade || []}
              loading={chartLoading}
            />
          </div>
        </div>

        <div className="mt-6 bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30">
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-2">
            Tren Kehadiran {year}
          </p>
          <AttendanceTrendChart year={year} loading={chartLoading} />
        </div>
      </div>
    </div>
  );
}
