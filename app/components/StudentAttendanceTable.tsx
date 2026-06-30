"use client";

import { Loader2 } from "lucide-react";

interface StudentRow {
  _id: string;
  studentIndex: number;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
}

interface Props {
  data: StudentRow[];
  loading: boolean;
  totalItems?: number;
}

const STATUSES = [
  { key: "hadir" as const, label: "Hadir", dot: "bg-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300" },
  { key: "sakit" as const, label: "Sakit", dot: "bg-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-300" },
  { key: "izin" as const, label: "Izin", dot: "bg-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300" },
  { key: "alpha" as const, label: "Alpha", dot: "bg-red-400", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300" },
];

const RATE_COLORS = [
  {
    min: 80,
    bg: "bg-emerald-500",
    ring: "stroke-emerald-500",
    avatar: "bg-emerald-500",
  },
  {
    min: 50,
    bg: "bg-orange-500",
    ring: "stroke-orange-500",
    avatar: "bg-orange-500",
  },
  { min: 0, bg: "bg-red-500", ring: "stroke-red-500", avatar: "bg-red-500" },
];

function getRateColor(rate: number) {
  return RATE_COLORS.find((c) => rate >= c.min) || RATE_COLORS[RATE_COLORS.length - 1];
}

export default function StudentAttendanceTable({ data, loading, totalItems = data.length }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
        Belum ada data kehadiran
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 animate-fadeInUp">
      {data.map((row, i) => {
        const total = row.hadir + row.sakit + row.izin + row.alpha;
        const rate = total > 0 ? Math.round((row.hadir / total) * 100) : 0;
        const colors = getRateColor(rate);
        const circumference = 2 * Math.PI * 18;
        const offset = circumference - (rate / 100) * circumference;

        return (
          <div
            key={row._id}
            className="group bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeInUp"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Header: Avatar + Name + Rate */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${colors.avatar}`}
              >
                {row.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-sm leading-tight">
                  {row.name}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  #{row.studentIndex + 1} dari {totalItems}
                </p>
              </div>
              <div className="relative shrink-0">
                <svg width="44" height="44" className="-rotate-90">
                  <circle
                    cx="22" cy="22" r="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-gray-100 dark:text-gray-700"
                  />
                  <circle
                    cx="22" cy="22" r="18"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`transition-all duration-700 ${colors.ring}`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-700 dark:text-gray-300">
                  {rate}%
                </span>
              </div>
            </div>

            {/* Status grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {STATUSES.map((s) => (
                <div
                  key={s.key}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${s.bg}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className={`text-xs font-medium ${s.text}`}>
                    {row[s.key]}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${colors.bg}`}
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
