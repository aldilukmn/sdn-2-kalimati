"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  Circle,
  GraduationCap,
  School,
} from "lucide-react";
import DashboardService from "@/services/dashboard.service";
import AttendanceDonutChart from "@/app/components/AttendanceDonutChart";
import AttendanceBarChart from "@/app/components/AttendanceBarChart";

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  hoverClass: string;
  skeletonClass: string;
}

const GRADES = ["1", "2", "3", "4", "5", "6"];

export default function Dashboard() {
  const router = useRouter();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    totalRegistrants: number;
    validated: number;
    unvalidated: number;
    totalStudents: number;
    totalTeachers: number;
    attendanceByStatus: { hadir: number; sakit: number; izin: number; alpha: number } | null;
    attendanceByGrade: { grade: string; rate: number; studentCount: number }[] | null;
    totalDays: number;
  } | null>(null);

  const fetchData = async (m: number, y: number, isInitial = false) => {
    try {
      const res = await DashboardService.getSummary(m, y);
      const data = res.result || res.data || {};
      setSummary({
        totalRegistrants: data.totalRegistrants ?? 0,
        validated: data.validated ?? 0,
        unvalidated: data.unvalidated ?? 0,
        totalStudents: data.totalStudents ?? 0,
        totalTeachers: data.totalTeachers ?? 0,
        attendanceByStatus: data.attendanceByStatus || null,
        attendanceByGrade: data.attendanceByGrade || null,
        totalDays: data.totalDays ?? 0,
      });
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 401) {
        router.replace("/login");
        return;
      }
      setError(error.message || "Gagal memuat data dashboard");
    } finally {
      if (isInitial) setLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    const isInitial = summary === null;
    if (isInitial) setLoading(true);
    setChartLoading(true);
    setError(null);
    fetchData(month, year, isInitial);
  }, [month, year]);

  const cards: StatCard[] = [
    {
      label: "Peserta Didik",
      value: summary?.totalStudents ?? "-",
      icon: GraduationCap,
      color: "indigo",
      bgClass: "bg-indigo-500/5",
      borderClass: "border-indigo-500/40",
      textClass: "text-indigo-600 dark:text-indigo-400",
      hoverClass: "hover:bg-indigo-500/10 hover:border-indigo-500/60 hover:shadow-indigo-500/10",
      skeletonClass: "bg-indigo-200 dark:bg-indigo-700",
    },
    {
      label: "GTK",
      value: summary?.totalTeachers ?? "-",
      icon: School,
      color: "teal",
      bgClass: "bg-teal-500/5",
      borderClass: "border-teal-500/40",
      textClass: "text-teal-600 dark:text-teal-400",
      hoverClass: "hover:bg-teal-500/10 hover:border-teal-500/60 hover:shadow-teal-500/10",
      skeletonClass: "bg-teal-200 dark:bg-teal-700",
    },
    {
      label: "Total Pendaftar",
      value: summary?.totalRegistrants ?? 0,
      icon: Users,
      color: "blue",
      bgClass: "bg-blue-500/5",
      borderClass: "border-blue-500/40",
      textClass: "text-blue-600 dark:text-blue-400",
      hoverClass: "hover:bg-blue-500/10 hover:border-blue-500/60 hover:shadow-blue-500/10",
      skeletonClass: "bg-blue-200 dark:bg-blue-700",
    },
    {
      label: "Tervalidasi",
      value: summary?.validated ?? 0,
      icon: CheckCircle2,
      color: "emerald",
      bgClass: "bg-emerald-500/5",
      borderClass: "border-emerald-500/40",
      textClass: "text-emerald-600 dark:text-emerald-400",
      hoverClass: "hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:shadow-emerald-500/10",
      skeletonClass: "bg-emerald-200 dark:bg-emerald-700",
    },
    {
      label: "Belum Divalidasi",
      value: summary?.unvalidated ?? 0,
      icon: Circle,
      color: "amber",
      bgClass: "bg-yellow-500/5",
      borderClass: "border-yellow-500/40",
      textClass: "text-amber-600 dark:text-amber-400",
      hoverClass: "hover:bg-yellow-500/10 hover:border-yellow-500/60 hover:shadow-yellow-500/10",
      skeletonClass: "bg-yellow-200 dark:bg-yellow-700",
    },
  ];

  const donutData = summary?.attendanceByStatus
    ? [
        { name: "hadir", value: summary.attendanceByStatus.hadir, color: "#10b981" },
        { name: "sakit", value: summary.attendanceByStatus.sakit, color: "#f59e0b" },
        { name: "izin", value: summary.attendanceByStatus.izin, color: "#3b82f6" },
        { name: "alpha", value: summary.attendanceByStatus.alpha, color: "#ef4444" },
      ]
    : [];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`border ${card.borderClass} ${card.bgClass} px-5 py-6 rounded-xl duration-300 ${card.hoverClass} hover:shadow-md shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {card.label}
              </span>
              <card.icon size={22} className={card.textClass} />
            </div>
            <div className={`text-3xl font-bold ${card.textClass}`}>
              {loading ? (
                <div
                  className={`h-9 w-16 rounded ${card.skeletonClass} animate-pulse`}
                />
              ) : (
                card.value
              )}
            </div>
          </div>
        ))}
      </div>

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
