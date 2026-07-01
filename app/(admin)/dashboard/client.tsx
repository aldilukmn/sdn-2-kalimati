"use client";

import { useState, useEffect } from "react";
import { useTeacherDashboard, type TeacherSummary, type DashboardSummary } from "@/hooks/useDashboard";
import { useAuth } from "@/app/contexts/AuthContext";
import DashboardStatCards from "@/app/components/DashboardStatCards";
import AttendanceDonutChart from "@/app/components/AttendanceDonutChart";
import AttendanceBarChart from "@/app/components/AttendanceBarChart";
import MonthYearPicker from "@/app/components/MonthYearPicker";
import Pagination from "@/app/components/Pagination";
import StudentAttendanceTable from "@/app/components/StudentAttendanceTable";
import { Users, Mars, Venus, Loader2, LayoutDashboard } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useTeacherChart } from "@/hooks/useTeacherChart";
import type { AttendanceRow } from "@/lib/merge-attendance";

interface Props {
  userRole: string | null;
  userName: string | null;
  userGrade: string | null;
  initialMonth: number;
  initialYear: number;
  guruInitialSummary?: TeacherSummary | null;
  guruInitialChartData?: AttendanceRow[];
  guruInitialHasAttendance?: boolean;
  adminInitialSummary?: DashboardSummary | null;
}

function AdminDashboardView({ initialSummary, initialMonth, initialYear }: { initialSummary?: DashboardSummary | null; initialMonth?: number; initialYear?: number }) {
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
  } = useDashboard(initialSummary, initialMonth, initialYear);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative p-5 md:p-6 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/15 rounded-xl flex items-center justify-center animate-iconBounce">
            <LayoutDashboard size={26} className="md:size-[30px] text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg md:text-xl font-bold">
              Dashboard Admin
            </h1>
            <p className="text-indigo-200/80 text-xs md:text-sm mt-0.5">
              Ringkasan data pendaftar, guru, dan kehadiran siswa
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
          {error}
        </div>
      )}
      <DashboardStatCards summary={summary} loading={loading} />

      {/* Periode */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
          Periode
        </label>
        <div className="flex gap-3">
          <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm cursor-pointer dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 focus:border-blue-500"
          style={{ outline: "none" }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleDateString("id-ID", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 cursor-pointer"
        >
          {[2025, 2026, 2027].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Distribusi Kehadiran
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-500 mb-4">
            {new Date(0, month - 1).toLocaleDateString("id-ID", {
              month: "long",
            })}{" "}
            {year}
          </p>
          <AttendanceDonutChart
            data={donutData}
            loading={chartLoading}
            totalDays={summary?.totalDays}
          />
        </div>
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Kehadiran per Kelas
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-500 mb-4">
            {new Date(0, month - 1).toLocaleDateString("id-ID", {
              month: "long",
            })}{" "}
            {year}
          </p>
          <AttendanceBarChart
            data={summary?.attendanceByGrade || []}
            loading={chartLoading}
          />
        </div>
      </div>
    </div>
  );
}

function GuruDashboardView({
  initialSummary,
  initialChartData,
  initialHasAttendance,
  initialMonth,
  initialYear,
  userName,
  userGrade,
}: {
  initialSummary: TeacherSummary | null | undefined;
  initialChartData: AttendanceRow[] | undefined;
  initialHasAttendance: boolean | undefined;
  initialMonth: number;
  initialYear: number;
  userName: string | null;
  userGrade: string | null;
}) {
  const { loading, summary } = useTeacherDashboard(initialSummary);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [currentPage, setCurrentPage] = useState(1);
  const gradeReady = !!userGrade;

  const { data: chartData, loading: chartLoading, hasAttendanceData } = useTeacherChart(
    userGrade || "",
    month,
    year,
    initialChartData,
    initialHasAttendance,
    initialMonth,
    initialYear
  );

  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [month, year]);

  const totalPages = Math.ceil(chartData.length / itemsPerPage);
  const paginatedData = chartData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statCards = [
    {
      label: "Total Murid",
      value: summary?.totalStudents,
      icon: Users,
      color: "bg-gradient-to-br from-violet-400 to-purple-600",
    },
    {
      label: "Laki-laki",
      value: summary?.maleCount,
      icon: Mars,
      color: "bg-gradient-to-br from-sky-400 to-blue-600",
    },
    {
      label: "Perempuan",
      value: summary?.femaleCount,
      icon: Venus,
      color: "bg-gradient-to-br from-rose-400 to-pink-600",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {!gradeReady ? (
        <div className="h-28 w-full rounded-2xl animate-shimmer" />
      ) : (
        <div className="animate-fadeInUp">
          <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
            <div className="relative p-5 md:p-6 flex items-center gap-5">
              <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center animate-iconBounce">
                <LayoutDashboard
                  size={28}
                  className="md:size-[32px] text-white"
                />
              </div>
              <div className="min-w-0">
                <p className="text-indigo-200/80 text-xs md:text-sm font-medium tracking-wide">
                  Selamat Datang,
                </p>
                <h1 className="text-white text-lg md:text-xl font-bold truncate">
                  {userName || "Guru"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="group bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div
              className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 transition-transform duration-300 group-hover:rotate-3`}
            >
              <card.icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
              {loading ? (
                <div className="h-8 w-16 rounded mt-1 animate-shimmer" />
              ) : (
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {card.value ?? "-"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="animate-fadeInUp">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Rekapitulasi Kehadiran Murid
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Pantau kehadiran siswa per bulan
            </p>
          </div>

          <div className="shrink-0">
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              Periode
            </label>
            <MonthYearPicker
              month={month}
              year={year}
              onMonthChange={setMonth}
              onYearChange={setYear}
            />
          </div>
        </div>
      </div>

      {chartLoading ? (
        <StudentAttendanceTable
          data={paginatedData}
          loading={chartLoading}
          totalItems={chartData.length}
        />
      ) : !hasAttendanceData ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Belum Ada Data Kehadiran
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Silakan pilih bulan lain atau input presensi melalui menu Presensi
            Murid terlebih dahulu.
          </p>
        </div>
      ) : (
        <>
          <StudentAttendanceTable
            data={paginatedData}
            loading={chartLoading}
            totalItems={chartData.length}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={chartData.length}
          />
        </>
      )}
    </div>
  );
}

export default function DashboardClient({
  userRole,
  userName,
  userGrade,
  initialMonth,
  initialYear,
  guruInitialSummary,
  guruInitialChartData,
  guruInitialHasAttendance,
  adminInitialSummary,
}: Props) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (userRole === "guru") {
    return (
      <GuruDashboardView
        initialSummary={guruInitialSummary}
        initialChartData={guruInitialChartData}
        initialHasAttendance={guruInitialHasAttendance}
        initialMonth={initialMonth}
        initialYear={initialYear}
        userName={userName}
        userGrade={userGrade}
      />
    );
  }

  return <AdminDashboardView initialSummary={adminInitialSummary} initialMonth={initialMonth} initialYear={initialYear} />;
}
