"use client";

import { Trophy, AlertTriangle } from "lucide-react";

interface Props {
  attendanceByGrade: { grade: string; rate: number; studentCount: number }[] | null;
  loading?: boolean;
}

export default function InsightCards({ attendanceByGrade, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md: border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!attendanceByGrade || attendanceByGrade.length === 0) return null;

  const sorted = [...attendanceByGrade].sort((a, b) => b.rate - a.rate);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  if (best.grade === worst.grade) return null;

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md: border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
            <Trophy size={16} className="text-emerald-600 dark:text-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] md:text-[11px] font-semibold text-emerald-600 dark:text-emerald-300 uppercase tracking-wider">
              Kelas Terbaik
            </p>
            <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-white whitespace-nowrap truncate">
              Kelas {best.grade} — {best.rate}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/30 rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-red-600 dark:text-red-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] md:text-[11px] font-semibold text-red-600 dark:text-red-300 uppercase tracking-wider">
              Perlu Perhatian
            </p>
            <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-white whitespace-nowrap truncate">
              Kelas {worst.grade} — {worst.rate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
