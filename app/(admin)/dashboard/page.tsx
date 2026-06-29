"use client";

import { useEffect, useState } from "react";
import { useDashboard, useTeacherDashboard } from "@/hooks/useDashboard";
import DashboardStatCards from "@/app/components/DashboardStatCards";
import AttendanceDonutChart from "@/app/components/AttendanceDonutChart";
import AttendanceBarChart from "@/app/components/AttendanceBarChart";
import {
  Users,
  Mars,
  Venus,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch {}
    }
  }, []);

  if (userRole === null) {
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
  const { loading, summary } = useTeacherDashboard();

  const statCards = [
    { label: "Total Murid", value: summary?.totalStudents, icon: Users, color: "bg-blue-500" },
    { label: "Laki-laki", value: summary?.maleCount, icon: Mars, color: "bg-emerald-500" },
    { label: "Perempuan", value: summary?.femaleCount, icon: Venus, color: "bg-pink-500" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Ringkasan data kelas
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 animate-pulse">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {card.value ?? "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
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

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Ringkasan data sekolah
        </p>
      </div>

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
