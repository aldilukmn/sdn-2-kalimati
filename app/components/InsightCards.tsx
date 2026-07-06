"use client";

import { Trophy, AlertTriangle } from "lucide-react";

interface Props {
  attendanceByGrade: { grade: string; rate: number; studentCount: number }[] | null;
  loading?: boolean;
}

export default function InsightCards({ attendanceByGrade, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!attendanceByGrade || attendanceByGrade.length === 0) return null;

  const sorted = [...attendanceByGrade].sort((a, b) => b.rate - a.rate);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  if (best.grade === worst.grade) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex items-center gap-3 bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl px-4 py-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
          <Trophy size={16} className="text-emerald-600 dark:text-emerald-300" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300 uppercase tracking-wider">
            Kelas Terbaik
          </p>
          <p className="text-sm font-bold text-gray-800 dark:text-white">
            Kelas {best.grade} — {best.rate}%
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/30 rounded-xl px-4 py-3">
        <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
          <AlertTriangle size={16} className="text-red-600 dark:text-red-300" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-red-600 dark:text-red-300 uppercase tracking-wider">
            Perlu Perhatian
          </p>
          <p className="text-sm font-bold text-gray-800 dark:text-white">
            Kelas {worst.grade} — {worst.rate}%
          </p>
        </div>
      </div>
    </div>
  );
}
