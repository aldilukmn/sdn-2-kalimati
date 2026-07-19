"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS_ID } from "@/lib/format";
import { AVAILABLE_YEARS } from "@/lib/constants";

interface MonthYearFilterProps {
  month: number;
  onMonthChange: (month: number) => void;
  year: number;
  onYearChange: (year: number) => void;
  variant?: "dashboard" | "inline";
  className?: string;
}

export default function MonthYearFilter({
  month,
  onMonthChange,
  year,
  onYearChange,
  variant = "inline",
  className = "",
}: MonthYearFilterProps) {
  const isDashboard = variant === "dashboard";

  const triggerClass = isDashboard
    ? "h-auto rounded-lg border border-slate-300 bg-slate-50 px-4 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 flex-1"
    : "h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 flex-1";

  const content = (
    <div className={`flex items-center gap-1.5 md:gap-2.5 ${className}`}>
      <Select value={String(month)} onValueChange={(v) => { if (v !== null) onMonthChange(Number(v)); }}>
        <SelectTrigger className={triggerClass}>
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
      <Select value={String(year)} onValueChange={(v) => { if (v !== null) onYearChange(Number(v)); }}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Tahun" className="sr-only" />
          {year}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tahun</SelectLabel>
            {AVAILABLE_YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );

  if (isDashboard) {
    return (
      <div>
        <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
