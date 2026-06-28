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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    totalRegistrants: number;
    validated: number;
    unvalidated: number;
    totalStudents: number;
    totalTeachers: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DashboardService.getSummary();
        const data = res.result || res.data || {};
        setSummary({
          totalRegistrants: data.totalRegistrants ?? 0,
          validated: data.validated ?? 0,
          unvalidated: data.unvalidated ?? 0,
          totalStudents: data.totalStudents ?? 0,
          totalTeachers: data.totalTeachers ?? 0,
        });
      } catch (err) {
        const error = err as Error & { status?: number };
        if (error.status === 401) {
          router.replace("/login");
          return;
        }
        setError(error.message || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
                <div className={`h-9 w-16 rounded ${card.skeletonClass} animate-pulse`} />
              ) : (
                card.value
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
