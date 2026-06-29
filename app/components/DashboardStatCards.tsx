"use client";

import {
  Users,
  CheckCircle2,
  Circle,
  GraduationCap,
  School,
} from "lucide-react";
import type { DashboardSummary } from "@/hooks/useDashboard";

type StatCardKey =
  | "totalStudents"
  | "totalTeachers"
  | "totalRegistrants"
  | "validated"
  | "unvalidated";

interface StatCardItem {
  label: string;
  key: StatCardKey;
  icon: React.ElementType;
  fallback: number | string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  hoverClass: string;
  skeletonClass: string;
}

const CARDS: StatCardItem[] = [
  {
    label: "Peserta Didik",
    key: "totalStudents",
    icon: GraduationCap,
    fallback: "-",
    bgClass: "bg-indigo-500/5",
    borderClass: "border-indigo-500/40",
    textClass: "text-indigo-600 dark:text-indigo-400",
    hoverClass:
      "hover:bg-indigo-500/10 hover:border-indigo-500/60 hover:shadow-indigo-500/10",
    skeletonClass: "bg-indigo-200 dark:bg-indigo-700",
  },
  {
    label: "GTK",
    key: "totalTeachers",
    icon: School,
    fallback: "-",
    bgClass: "bg-teal-500/5",
    borderClass: "border-teal-500/40",
    textClass: "text-teal-600 dark:text-teal-400",
    hoverClass:
      "hover:bg-teal-500/10 hover:border-teal-500/60 hover:shadow-teal-500/10",
    skeletonClass: "bg-teal-200 dark:bg-teal-700",
  },
  {
    label: "Total Pendaftar",
    key: "totalRegistrants",
    icon: Users,
    fallback: 0,
    bgClass: "bg-blue-500/5",
    borderClass: "border-blue-500/40",
    textClass: "text-blue-600 dark:text-blue-400",
    hoverClass:
      "hover:bg-blue-500/10 hover:border-blue-500/60 hover:shadow-blue-500/10",
    skeletonClass: "bg-blue-200 dark:bg-blue-700",
  },
  {
    label: "Tervalidasi",
    key: "validated",
    icon: CheckCircle2,
    fallback: 0,
    bgClass: "bg-emerald-500/5",
    borderClass: "border-emerald-500/40",
    textClass: "text-emerald-600 dark:text-emerald-400",
    hoverClass:
      "hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:shadow-emerald-500/10",
    skeletonClass: "bg-emerald-200 dark:bg-emerald-700",
  },
  {
    label: "Belum Divalidasi",
    key: "unvalidated",
    icon: Circle,
    fallback: 0,
    bgClass: "bg-yellow-500/5",
    borderClass: "border-yellow-500/40",
    textClass: "text-amber-600 dark:text-amber-400",
    hoverClass:
      "hover:bg-yellow-500/10 hover:border-yellow-500/60 hover:shadow-yellow-500/10",
    skeletonClass: "bg-yellow-200 dark:bg-yellow-700",
  },
];

interface Props {
  summary: DashboardSummary | null;
  loading: boolean;
}

export default function DashboardStatCards({ summary, loading }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = summary?.[card.key] ?? card.fallback;
        return (
          <div
            key={card.label}
            className={`border ${card.borderClass} ${card.bgClass} px-5 py-6 rounded-xl duration-300 ${card.hoverClass} hover:shadow-md shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {card.label}
              </span>
              <Icon size={22} className={card.textClass} />
            </div>
            <div className={`text-3xl font-bold ${card.textClass}`}>
              {loading ? (
                <div
                  className={`h-9 w-16 rounded ${card.skeletonClass} animate-pulse`}
                />
              ) : (
                value
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
