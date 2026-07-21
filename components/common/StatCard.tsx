"use client";

import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "glass" | "simple";
  color: string;
  loading?: boolean;
  suffix?: string;
  subtitle?: string;
  valueClassName?: string;
}

const GlassColors: Record<
  string,
  { bg: string; border: string; text: string; skel: string }
> = {
  indigo: {
    bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
    border: "border-indigo-500/40 dark:border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
    skel: "bg-indigo-200 dark:bg-indigo-700",
  },
  teal: {
    bg: "bg-teal-500/5 dark:bg-teal-500/10",
    border: "border-teal-500/40 dark:border-teal-500/30",
    text: "text-teal-600 dark:text-teal-400",
    skel: "bg-teal-200 dark:bg-teal-700",
  },
  blue: {
    bg: "bg-blue-500/5 dark:bg-blue-500/10",
    border: "border-blue-500/40 dark:border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    skel: "bg-blue-200 dark:bg-blue-700",
  },
  emerald: {
    bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    border: "border-emerald-500/40 dark:border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    skel: "bg-emerald-200 dark:bg-emerald-700",
  },
  yellow: {
    bg: "bg-yellow-500/5 dark:bg-yellow-500/10",
    border: "border-yellow-500/40 dark:border-yellow-500/30",
    text: "text-yellow-600 dark:text-yellow-400",
    skel: "bg-yellow-200 dark:bg-yellow-700",
  },
  red: {
    bg: "bg-red-500/5 dark:bg-red-500/10",
    border: "border-red-500/40 dark:border-red-500/30",
    text: "text-red-600 dark:text-red-400",
    skel: "bg-red-200 dark:bg-red-700",
  },
};

const SimpleColors: Record<
  string,
  { bg: string; border: string; icon: string; val: string; skel: string }
> = {
  indigo: {
    bg: "bg-indigo-50/80 dark:bg-indigo-950/20",
    border: "border-indigo-200/50 dark:border-indigo-800/30",
    icon: "text-indigo-500 dark:text-indigo-400",
    val: "text-indigo-700 dark:text-indigo-300",
    skel: "bg-indigo-200 dark:bg-indigo-700",
  },
  emerald: {
    bg: "bg-emerald-50/80 dark:bg-emerald-950/20",
    border: "border-emerald-200/50 dark:border-emerald-800/30",
    icon: "text-emerald-500 dark:text-emerald-400",
    val: "text-emerald-700 dark:text-emerald-300",
    skel: "bg-emerald-200 dark:bg-emerald-700",
  },
  rose: {
    bg: "bg-rose-50/80 dark:bg-rose-950/20",
    border: "border-rose-200/50 dark:border-rose-800/30",
    icon: "text-rose-500 dark:text-rose-400",
    val: "text-rose-700 dark:text-rose-300",
    skel: "bg-rose-200 dark:bg-rose-700",
  },
  amber: {
    bg: "bg-amber-50/80 dark:bg-amber-950/20",
    border: "border-amber-200/50 dark:border-amber-800/30",
    icon: "text-amber-500 dark:text-amber-400",
    val: "text-amber-700 dark:text-amber-300",
    skel: "bg-amber-200 dark:bg-amber-700",
  },
  sky: {
    bg: "bg-sky-50/80 dark:bg-sky-950/20",
    border: "border-sky-200/50 dark:border-sky-800/30",
    icon: "text-sky-500 dark:text-sky-400",
    val: "text-sky-700 dark:text-sky-300",
    skel: "bg-sky-200 dark:bg-sky-700",
  },
  orange: {
    bg: "bg-orange-50/80 dark:bg-orange-950/20",
    border: "border-orange-200/50 dark:border-orange-800/30",
    icon: "text-orange-500 dark:text-orange-400",
    val: "text-orange-700 dark:text-orange-300",
    skel: "bg-orange-200 dark:bg-orange-700",
  },
  violet: {
    bg: "bg-violet-50/80 dark:bg-violet-950/20",
    border: "border-violet-200/50 dark:border-violet-800/30",
    icon: "text-violet-500 dark:text-violet-400",
    val: "text-violet-700 dark:text-violet-300",
    skel: "bg-violet-200 dark:bg-violet-700",
  },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = "glass",
  color,
  loading,
  suffix,
  subtitle,
  valueClassName,
}: StatCardProps) {
  if (variant === "simple") {
    const c = SimpleColors[color] ?? SimpleColors.indigo;
    return (
      <div
        className={`${c.bg} rounded-xl p-4 border ${c.border} ${
          subtitle ? "" : ""
        }`}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Icon size={14} className={`${c.icon} shrink-0`} />
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        {loading ? (
          <div className={`h-5 w-20 rounded ${c.skel} animate-pulse`} />
        ) : (
          <p
            className={`text-lg md:text-2xl font-bold ${valueClassName || c.val}`}
          >
            {value}
            {suffix || ""}
          </p>
        )}
        {subtitle && !loading && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  const c = GlassColors[color] ?? GlassColors.indigo;
  return (
    <div
      className={`${c.bg} md: border ${c.border} shadow-lg rounded-2xl p-3 md:p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl`}
    >
      <div className="flex items-center md:items-start justify-center md:justify-between mb-1 md:mb-3 min-h-10">
        <span className="text-[13px] text-center md:text-base font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <Icon
          className={`hidden md:block w-[22px] h-[22px] ${c.text}`}
        />
      </div>
      <div className="flex items-center justify-center md:justify-start gap-2">
        <Icon className={`md:hidden w-4 h-4 ${c.text}`} />
        {loading ? (
          <div className={`h-9 w-16 rounded ${c.skel} animate-pulse`} />
        ) : (
          <span className={`text-lg md:text-3xl font-bold ${valueClassName || c.text}`}>
            {value}
            {suffix || ""}
          </span>
        )}
      </div>
      {subtitle && !loading && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
