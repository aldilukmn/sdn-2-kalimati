"use client";

import { useState, useEffect } from "react";
import {
  useTeacherDashboard,
  type TeacherSummary,
  type DashboardSummary,
} from "@/hooks/useDashboard";
import { useAuth } from "@/app/contexts/AuthContext";
import DashboardStatCards from "@/app/components/DashboardStatCards";
import AttendanceDonutChart from "@/app/components/AttendanceDonutChart";
import AttendanceBarChart from "@/app/components/AttendanceBarChart";
import MonthYearPicker from "@/app/components/MonthYearPicker";
import Pagination from "@/app/components/Pagination";
import StudentAttendanceTable from "@/app/components/StudentAttendanceTable";
import {
  Users,
  Mars,
  Venus,
  Loader2,
  LayoutDashboard,
  Wallet,
  CalendarCheck,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useTeacherChart } from "@/hooks/useTeacherChart";
import { useSavingsRecap } from "@/hooks/useSavingsRecap";
import { GRADES } from "@/hooks/useStudentSavings";
import { formatCompactRupiah } from "@/lib/format";
import LoadingDots from "@/app/components/LoadingDots";
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

function AdminDashboardView({
  initialSummary,
  initialMonth,
  initialYear,
}: {
  initialSummary?: DashboardSummary | null;
  initialMonth?: number;
  initialYear?: number;
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
  } = useDashboard(initialSummary, initialMonth, initialYear);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative p-5 md:p-6 flex items-center gap-4 animate-fadeInUp">
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

      <TabunganSection />

      {/* Rekapitulasi Kehadiran — satu card */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row items-center gap-2.5 mb-4">
          <div className="flex items-center gap-2.5 mb-3 md:mb-0">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
              <CalendarCheck
                size={16}
                className="text-indigo-600 dark:text-indigo-300"
              />
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Rekapitulasi Kehadiran
            </h3>
          </div>
          <div className="md:ml-auto">
            <MonthYearPicker
              month={month}
              year={year}
              onMonthChange={setMonth}
              onYearChange={setYear}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30 animate-fadeInUp">
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Distribusi Kehadiran
            </p>
            <AttendanceDonutChart
              data={donutData}
              loading={chartLoading}
              totalDays={summary?.totalDays}
            />
          </div>
          <div className="bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30 animate-fadeInUp">
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Kehadiran per Kelas
            </p>
            <AttendanceBarChart
              data={summary?.attendanceByGrade || []}
              loading={chartLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TabunganSection({ grade }: { grade?: string | null }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [filterGrade, setFilterGrade] = useState(grade ?? "");
  const { data, loading } = useSavingsRecap(
    filterGrade || undefined,
    month,
    year,
  );

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2.5 mb-4">
        <div className="flex items-center gap-2.5 mb-3 md:mb-0">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
            <Wallet
              size={16}
              className="text-indigo-600 dark:text-indigo-300"
            />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Rekapitulasi Tabungan
          </h3>
        </div>
        <div className="flex items-center gap-2.5 md:ml-auto">
          <div className="relative">
            <Users size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="h-8 rounded border border-slate-300 bg-slate-50 pl-7 pr-2 text-xs text-slate-700 text-center appearance-none min-w-[130px] transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 cursor-pointer"
            >
              <option value="">Semua Kelas</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  Kelas {g}
                </option>
              ))}
            </select>
          </div>
          <MonthYearPicker
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>
      </div>

      {!loading &&
      data &&
      data.monthlyDeposits === 0 &&
      data.monthlyWithdrawals === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-3xl mb-2">🏦</div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Belum Ada Data Tabungan
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Belum ada siswa yang menabung di bulan ini
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-sky-50/80 dark:bg-sky-950/20 rounded-xl p-4 border border-sky-200/50 dark:border-sky-800/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Saldo
            </p>
            <p className="text-lg md:text-2xl font-bold text-sky-700 dark:text-sky-300 mt-1">
              {loading ? <LoadingDots /> : formatCompactRupiah(data?.totalBalance || 0)}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {loading ? <LoadingDots /> : `${data?.totalStudents || 0} siswa menabung`}
            </p>
          </div>
          <div className="bg-emerald-50/80 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Setoran Bulan Ini
            </p>
            <p className="text-lg md:text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
              {loading
                ? <LoadingDots />
                : formatCompactRupiah(data?.monthlyDeposits || 0)}
            </p>
          </div>
          <div className="bg-orange-50/80 dark:bg-orange-950/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Penarikan Bulan Ini
            </p>
            <p className="text-lg md:text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1">
              {loading
                ? <LoadingDots />
                : formatCompactRupiah(data?.monthlyWithdrawals || 0)}
            </p>
          </div>
          <div className="bg-violet-50/80 dark:bg-violet-950/20 rounded-xl p-4 border border-violet-200/50 dark:border-violet-800/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Selisih Bulan Ini
            </p>
            <p
              className={`text-lg md:text-2xl font-bold mt-1 ${
                loading
                  ? "text-gray-700 dark:text-gray-300"
                  : (data?.monthlyDeposits || 0) -
                        (data?.monthlyWithdrawals || 0) >=
                      0
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {loading
                ? <LoadingDots />
                : formatCompactRupiah(
                    (data?.monthlyDeposits || 0) -
                      (data?.monthlyWithdrawals || 0),
                  )}
            </p>
          </div>
        </div>
      )}
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

  const itemsPerPage = 5;

  const averageAttendance = !chartLoading && hasAttendanceData && chartData.length > 0
    ? Math.round(
        chartData.reduce((sum, s) => {
          const total = s.hadir + s.sakit + s.izin + s.absen;
          return sum + (total > 0 ? (s.hadir / total) * 100 : 0);
        }, 0) / chartData.length
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

  return (
    <div className="p-4 md:p-6 space-y-6">
      {!gradeReady ? (
        <div className="h-28 w-full rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-700" />
      ) : (
        <>
          <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
            <div className="relative p-5 md:p-6 flex items-center gap-5 animate-fadeInUp">
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
        </>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`group ${card.orderClass} bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl`}
          >
            <div
              className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 transition-transform duration-300 group-hover:rotate-3 animate-fadeInUp`}
            >
              <card.icon size={24} className="text-white" />
            </div>
            <div className="animate-fadeInUp">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
              {(card.label === "Rata-rata Kehadiran" ? chartLoading : loading) ? (
                <div
                  className={`h-8 w-16 rounded mt-1 animate-pulse ${card.skeletonClass}`}
                />
              ) : (
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {card.value !== null && card.value !== undefined
                    ? `${card.value}${card.label === "Kehadiran" ? " %" : ""}`
                    : "-"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <TabunganSection grade={userGrade} />
      {chartLoading ? (
        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-0 animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-4">
            <div className="text-center md:text-start">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
                Rekapitulasi Kehadiran Murid
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Pantau kehadiran siswa per bulan
              </p>
            </div>
            <div className="shrink-0">
              <MonthYearPicker
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
              />
            </div>
          </div>
          <StudentAttendanceTable
            data={paginatedData}
            loading={chartLoading}
            totalItems={chartData.length}
          />
        </div>
      ) : !hasAttendanceData ? (
        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-0 animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-4">
            <div className="text-center md:text-start">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
                Rekapitulasi Kehadiran Murid
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Pantau kehadiran siswa per bulan
              </p>
            </div>
            <div className="shrink-0">
              <MonthYearPicker
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Belum Ada Data Kehadiran
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              Silakan pilih bulan lain atau input presensi melalui menu Presensi
              Murid terlebih dahulu.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-0 animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-4">
            <div className="text-center md:text-start">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
                Rekapitulasi Kehadiran Murid
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Pantau kehadiran siswa per bulan
              </p>
            </div>
            <div className="shrink-0">
              <MonthYearPicker
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
              />
            </div>
          </div>
          <StudentAttendanceTable
            data={paginatedData}
            loading={chartLoading}
            totalItems={chartData.length}
          />
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={chartData.length}
            />
          </div>
        </div>
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

  return (
    <AdminDashboardView
      initialSummary={adminInitialSummary}
      initialMonth={initialMonth}
      initialYear={initialYear}
    />
  );
}
