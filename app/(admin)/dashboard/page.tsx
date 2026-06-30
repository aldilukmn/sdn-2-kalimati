"use client";

import { useState } from "react";
import { useDashboard, useTeacherDashboard } from "@/hooks/useDashboard";
import { useTeacherChart } from "@/hooks/useTeacherChart";
import { useAuth } from "@/app/contexts/AuthContext";
import DashboardStatCards from "@/app/components/DashboardStatCards";
import AttendanceDonutChart from "@/app/components/AttendanceDonutChart";
import AttendanceBarChart from "@/app/components/AttendanceBarChart";
import MonthYearPicker from "@/app/components/MonthYearPicker";
import StudentAttendanceTable from "@/app/components/StudentAttendanceTable";
import { Users, Mars, Venus, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (userRole === "guru") return <GuruDashboard />;

  return <AdminDashboard />;
}

function GuruDashboard() {
  const { grade: userGrade } = useAuth();
  const { loading, summary } = useTeacherDashboard();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { data: chartData, loading: chartLoading } = useTeacherChart(
    userGrade || "1",
    month,
    year,
  );

  const statCards = [
    {
      label: "Total Murid",
      value: summary?.totalStudents,
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      label: "Laki-laki",
      value: summary?.maleCount,
      icon: Mars,
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
    {
      label: "Perempuan",
      value: summary?.femaleCount,
      icon: Venus,
      color: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-2xl p-5 flex items-center gap-4"
          >
            <div
              className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/10`}
            >
              <card.icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {card.value ?? "-"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-700 dark:from-gray-800 dark:to-gray-800 dark:border-b dark:border-gray-700 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-base font-semibold text-white dark:text-gray-200">
              Kehadiran Murid
            </h3>
            <MonthYearPicker
              month={month}
              year={year}
              onMonthChange={setMonth}
              onYearChange={setYear}
            />
          </div>
        </div>
        <div className="p-0">
          <StudentAttendanceTable data={chartData} loading={chartLoading} />
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
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
  } = useDashboard();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
          {error}
        </div>
      )}
      <DashboardStatCards summary={summary} loading={loading} />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-emerald-500/40 dark:border-emerald-500/30 rounded-xl p-5 bg-emerald-500/5 dark:bg-emerald-500/10 shadow hover:shadow-md hover:bg-emerald-500/10 duration-300">
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
        <div className="border border-indigo-500/40 dark:border-indigo-500/30 rounded-xl p-5 bg-indigo-500/5 dark:bg-indigo-500/10 shadow hover:shadow-md hover:bg-indigo-500/10 duration-300">
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
