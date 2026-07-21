"use client";

import { CalendarX } from "lucide-react";
import { formatDateID } from "@/lib/format";

interface HolidayInfoCardProps {
  currentHoliday?: { date: string; description: string; type: string };
  message: string;
}

export default function HolidayInfoCard({
  currentHoliday,
  message,
}: HolidayInfoCardProps) {
  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md: border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-6 md:p-8 text-center animate-fadeIn">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
        <CalendarX
          size={32}
          className="text-amber-600 dark:text-amber-400"
        />
      </div>
      {currentHoliday && (
        <>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-1">
            {formatDateID(currentHoliday.date)}
          </p>
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-1">
            {currentHoliday.description}
          </h3>
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-4 ${
              currentHoliday.type === "sunday"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            }`}
          >
            {currentHoliday.type === "sunday"
              ? "Hari Minggu"
              : "Libur Nasional"}
          </span>
        </>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
