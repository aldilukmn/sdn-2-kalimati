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
import AttendanceTrendChart from "@/app/components/AttendanceTrendChart";
import SavingsTrendChart from "@/app/components/SavingsTrendChart";
import InsightCards from "@/app/components/InsightCards";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useTeacherChart } from "@/hooks/useTeacherChart";
import { useSavingsRecap } from "@/hooks/useSavingsRecap";
import { GRADES } from "@/lib/constants";
import { formatCompactRupiah, MONTHS_ID } from "@/lib/format";
import StatCard from "@/app/components/StatCard";
import PageHero from "@/app/components/PageHero";
import type { AttendanceRow } from "@/lib/merge-attendance";

interface Props {
  userRole: string | null;
  userName: string | null;
  userGrade: string | null;
  isTreasurer: boolean;
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
      <PageHero icon={LayoutDashboard} title="Dashboard Admin" description="Ringkasan data pendaftar, guru, dan kehadiran siswa" />

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
          {error}
        </div>
      )}
      <DashboardStatCards summary={summary} loading={loading} />

      <InsightCards attendanceByGrade={summary?.attendanceByGrade || null} loading={chartLoading} />

      <TabunganSection userRole={userRole} />

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
            <div className="flex items-center gap-2">
              <Select
                value={String(month)}
                onValueChange={(v) => { if (v !== null) setMonth(Number(v)); }}
              >
                <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[110px]">
                  <SelectValue placeholder="Bulan" className="sr-only" />
                  {MONTHS_ID[month - 1]}
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bulan</SelectLabel>
                    {MONTHS_ID.map((name, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={String(year)}
                onValueChange={(v) => { if (v !== null) setYear(Number(v)); }}
              >
                <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[80px]">
                  <SelectValue placeholder="Tahun" className="sr-only" />
                  {year}
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tahun</SelectLabel>
                    {[2026, 2027].map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                  {attendanceDelta >= 0 ? "▲" : "▼"} {Math.abs(attendanceDelta)}%
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

function TabunganSection({ grade, userRole, isTreasurer }: { grade?: string | null; userRole?: string | null; isTreasurer?: boolean }) {
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
        <div className="grid grid-cols-3 gap-1.5 w-full md:flex md:w-auto md:items-center md:gap-2.5 md:ml-auto">
          {userRole === "guru" && !isTreasurer ? (
            <div className="h-auto w-full md:w-32 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-center dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
              {filterGrade ? `Kelas ${filterGrade}` : "Semua Kelas"}
            </div>
          ) : (
            <Select
              value={filterGrade}
              onValueChange={(v) => {
                if (v !== null) setFilterGrade(v);
              }}
            >
              <SelectTrigger className="h-auto w-full md:w-32 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Semua Kelas" className="sr-only" />
                {filterGrade ? `Kelas ${filterGrade}` : "Semua Kelas"}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kelas</SelectLabel>
                  <SelectItem value="">Semua Kelas</SelectItem>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      Kelas {g}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Select
            value={String(month)}
            onValueChange={(v) => {
              if (v !== null) setMonth(Number(v));
            }}
          >
            <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-full md:w-[90px]">
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
          <Select
            value={String(year)}
            onValueChange={(v) => {
              if (v !== null) setYear(Number(v));
            }}
          >
            <SelectTrigger className="h-auto w-full md:w-[80px] rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
              <SelectValue placeholder="Tahun" className="sr-only" />
              {year}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tahun</SelectLabel>
                {[2026, 2027].map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
          <StatCard
            variant="simple"
            label="Total Saldo"
            value={formatCompactRupiah(data?.totalBalance || 0)}
            icon={Wallet}
            color="sky"
            loading={loading}
            subtitle={data ? `${data.totalStudents || 0} siswa menabung` : undefined}
          />
          <StatCard
            variant="simple"
            label="Setoran Bulan Ini"
            value={formatCompactRupiah(data?.monthlyDeposits || 0)}
            icon={TrendingUp}
            color="emerald"
            loading={loading}
          />
          <StatCard
            variant="simple"
            label="Penarikan Bulan Ini"
            value={formatCompactRupiah(data?.monthlyWithdrawals || 0)}
            icon={TrendingDown}
            color="orange"
            loading={loading}
          />
          <StatCard
            variant="simple"
            label="Selisih Bulan Ini"
            value={formatCompactRupiah((data?.monthlyDeposits || 0) - (data?.monthlyWithdrawals || 0))}
            icon={TrendingUp}
            color="violet"
            loading={loading}
            valueClassName={
              loading
                ? ""
                : (data?.monthlyDeposits || 0) - (data?.monthlyWithdrawals || 0) >= 0
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-600 dark:text-red-400"
            }
          />
        </div>
      )}
      <div className="mt-4 bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30">
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-2">
          Tren Tabungan {year}
        </p>
        <SavingsTrendChart year={year} grade={filterGrade || undefined} />
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
  userRole,
  isTreasurer,
}: {
  initialSummary: TeacherSummary | null | undefined;
  initialChartData: AttendanceRow[] | undefined;
  initialHasAttendance: boolean | undefined;
  initialMonth: number;
  initialYear: number;
  userName: string | null;
  userGrade: string | null;
  userRole: string | null;
  isTreasurer: boolean;
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
            className={`group ${card.orderClass} bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-3 md:p-5 flex items-center gap-3 md:gap-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl`}
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
      <TabunganSection grade={userGrade} userRole={userRole} isTreasurer={isTreasurer} />
      {chartLoading ? (
        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-0">
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
              <div className="flex items-center gap-2">
                <Select
                  value={String(month)}
                  onValueChange={(v) => { if (v !== null) setMonth(Number(v)); }}
                >
                  <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[110px]">
                    <SelectValue placeholder="Bulan" className="sr-only" />
                    {MONTHS_ID[month - 1]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bulan</SelectLabel>
                      {MONTHS_ID.map((name, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={String(year)}
                  onValueChange={(v) => { if (v !== null) setYear(Number(v)); }}
                >
                  <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[80px]">
                    <SelectValue placeholder="Tahun" className="sr-only" />
                    {year}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tahun</SelectLabel>
                      {[2026, 2027].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <StudentAttendanceTable
            data={paginatedData}
            loading={chartLoading}
            totalItems={chartData.length}
          />
        </div>
      ) : !hasAttendanceData ? (
        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-0">
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
              <div className="flex items-center gap-2">
                <Select
                  value={String(month)}
                  onValueChange={(v) => { if (v !== null) setMonth(Number(v)); }}
                >
                  <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[110px]">
                    <SelectValue placeholder="Bulan" className="sr-only" />
                    {MONTHS_ID[month - 1]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bulan</SelectLabel>
                      {MONTHS_ID.map((name, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={String(year)}
                  onValueChange={(v) => { if (v !== null) setYear(Number(v)); }}
                >
                  <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[80px]">
                    <SelectValue placeholder="Tahun" className="sr-only" />
                    {year}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tahun</SelectLabel>
                      {[2026, 2027].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
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
        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-0">
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
              <div className="flex items-center gap-2">
                <Select
                  value={String(month)}
                  onValueChange={(v) => { if (v !== null) setMonth(Number(v)); }}
                >
                  <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[110px]">
                    <SelectValue placeholder="Bulan" className="sr-only" />
                    {MONTHS_ID[month - 1]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bulan</SelectLabel>
                      {MONTHS_ID.map((name, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={String(year)}
                  onValueChange={(v) => { if (v !== null) setYear(Number(v)); }}
                >
                  <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-[80px]">
                    <SelectValue placeholder="Tahun" className="sr-only" />
                    {year}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tahun</SelectLabel>
                      {[2026, 2027].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30">
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-2">
                Distribusi Kehadiran
              </p>
              <AttendanceDonutChart
                data={guruDonutData}
                loading={chartLoading}
              />
            </div>
            <div>
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
  isTreasurer,
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
        userRole={userRole}
        isTreasurer={isTreasurer}
      />
    );
  }

  return (
    <AdminDashboardView
      initialSummary={adminInitialSummary}
      initialMonth={initialMonth}
      initialYear={initialYear}
      userRole={userRole}
    />
  );
}
