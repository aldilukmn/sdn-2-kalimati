"use client";

import { useState, useEffect } from "react";
import { Users, Mars, Venus, CalendarCheck, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useTeacherDashboard, type TeacherSummary } from "@/hooks/useDashboard";
import { useTeacherChart } from "@/hooks/useTeacherChart";
import AttendanceDonutChart from "@/app/components/AttendanceDonutChart";
import PageHero from "@/app/components/PageHero";
import TabunganSection from "./TabunganSection";
import type { AttendanceRow } from "@/lib/merge-attendance";
import MonthYearFilter from "@/app/components/shared/MonthYearFilter";

export default function GuruDashboardView({
  initialSummary,
  initialChartData,
  initialHasAttendance,
  initialMonth,
  initialYear,
  userName,
  userGrade,
  userRole,
  isSavingsHolder,
}: {
  initialSummary: TeacherSummary | null | undefined;
  initialChartData: AttendanceRow[] | undefined;
  initialHasAttendance: boolean | undefined;
  initialMonth: number;
  initialYear: number;
  userName: string | null;
  userGrade: string | null;
  userRole: string | null;
  isSavingsHolder: boolean;
}) {
  const { loading, summary } = useTeacherDashboard(initialSummary);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [currentPage, setCurrentPage] = useState(1);
  const gradeReady = !!userGrade;

  const {
    data: chartData,
    loading: chartLoading,
    hasAttendanceData,
  } = useTeacherChart(
    userGrade || "",
    month,
    year,
    initialChartData,
    initialHasAttendance,
    initialMonth,
    initialYear,
  );

  const guruDonutData = !chartLoading && hasAttendanceData && chartData.length > 0
    ? [
        { name: "hadir", value: chartData.reduce((s, r) => s + r.hadir, 0), color: "#10b981" },
        { name: "sakit", value: chartData.reduce((s, r) => s + r.sakit, 0), color: "#f59e0b" },
        { name: "izin", value: chartData.reduce((s, r) => s + r.izin, 0), color: "#3b82f6" },
        { name: "absen", value: chartData.reduce((s, r) => s + r.absen, 0), color: "#ef4444" },
      ]
    : [];

  const guruTotalDays =
    !chartLoading && hasAttendanceData && chartData.length > 0
      ? Math.max(...chartData.map((s) => s.hadir + s.sakit + s.izin + s.absen))
      : 0;

  const itemsPerPage = 5;

  const averageAttendance =
    !chartLoading && hasAttendanceData && chartData.length > 0
      ? Math.round(
          chartData.reduce((sum, s) => {
            const total = s.hadir + s.sakit + s.izin + s.absen;
            return sum + (total > 0 ? (s.hadir / total) * 100 : 0);
          }, 0) / chartData.length,
        )
      : null;

  useEffect(() => {
    setCurrentPage(1);
  }, [month, year]);

  const totalPages = Math.ceil(chartData.length / itemsPerPage);
  const paginatedData = chartData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const statCards = [
    {
      label: "Total Murid",
      value: summary?.totalStudents,
      icon: Users,
      color: "bg-gradient-to-br from-violet-400 to-purple-600",
      skeletonClass: "bg-violet-200 dark:bg-violet-700",
      orderClass: "order-1 lg:order-1",
    },
    {
      label: "Laki-laki",
      value: summary?.maleCount,
      icon: Mars,
      color: "bg-gradient-to-br from-sky-400 to-blue-600",
      skeletonClass: "bg-sky-200 dark:bg-sky-700",
      orderClass: "order-3 lg:order-2",
    },
    {
      label: "Perempuan",
      value: summary?.femaleCount,
      icon: Venus,
      color: "bg-gradient-to-br from-rose-400 to-pink-600",
      skeletonClass: "bg-rose-200 dark:bg-rose-700",
      orderClass: "order-4 lg:order-3",
    },
    {
      label: "Kehadiran",
      value: averageAttendance,
      icon: CalendarCheck,
      color: "bg-gradient-to-br from-amber-400 to-orange-600",
      skeletonClass: "bg-amber-200 dark:bg-amber-700",
      orderClass: "order-2 lg:order-4",
    },
  ];

  const monthYearFilter = (
    <MonthYearFilter month={month} onMonthChange={setMonth} year={year} onYearChange={setYear} variant="inline" />
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {!gradeReady ? (
        <div className="h-28 w-full rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-700" />
      ) : (
        <>
          <PageHero icon={LayoutDashboard} title={userName || "Guru"} subtitle="Selamat Datang," iconSize="large" />
        </>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`group ${card.orderClass} bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-3 md:p-5 flex items-center gap-3 md:gap-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl`}
          >
            <div
              className={`w-10 h-10 md:w-14 md:h-14 ${card.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 transition-transform duration-300 group-hover:rotate-3`}
            >
              <card.icon size={16} className="md:size-[24px] text-white" />
            </div>
            <div>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
              {(
                card.label === "Rata-rata Kehadiran" ? chartLoading : loading
              ) ? (
                <div
                  className={`h-6 w-12 md:h-8 md:w-16 rounded mt-1 animate-pulse ${card.skeletonClass}`}
                />
              ) : (
                <p className="text-base md:text-2xl font-bold text-gray-800 dark:text-white">
                  {card.value !== null && card.value !== undefined
                    ? `${card.value}${card.label === "Kehadiran" ? " %" : ""}`
                    : "-"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <TabunganSection grade={userGrade} userRole={userRole} isSavingsHolder={isSavingsHolder} />
      <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-0">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-4">
          <div className="text-center md:text-start">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Ringkasan Kehadiran
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Distribusi kehadiran siswa per bulan
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            {monthYearFilter}
          </div>
        </div>

        {chartLoading || hasAttendanceData ? (
          <div className="bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30">
            <AttendanceDonutChart
              data={guruDonutData}
              loading={chartLoading}
              totalDays={guruTotalDays}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Belum Ada Data Kehadiran
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              Silakan pilih bulan lain atau input presensi melalui menu Presensi Murid.
            </p>
          </div>
        )}

        <div className="mt-5 flex justify-center md:justify-end">
          <Link
            href="/dashboard-presensi"
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            Lihat Detail Presensi &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
