"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface MonthYearPickerProps {
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 2 + i);

export default function MonthYearPicker({ month, year, onMonthChange, onYearChange }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date(year, month - 1);
  const formatted = format(currentDate, "MMMM yyyy", { locale: id });

  const prevMonth = () => {
    const prev = subMonths(currentDate, 1);
    onMonthChange(prev.getMonth() + 1);
    onYearChange(prev.getFullYear());
  };

  const nextMonth = () => {
    const next = addMonths(currentDate, 1);
    onMonthChange(next.getMonth() + 1);
    onYearChange(next.getFullYear());
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={prevMonth}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
        title="Bulan sebelumnya"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="relative" ref={panelRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-44 items-center gap-2.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 cursor-pointer"
        >
          <CalendarDays size={18} className="shrink-0 text-blue-500" />
          <span className="font-medium capitalize">{formatted}</span>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((name, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { onMonthChange(i + 1); setOpen(false); }}
                  className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    month === i + 1
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>

            <hr className="my-3 border-slate-200 dark:border-gray-700" />

            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => { onYearChange(y); setOpen(false); }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    year === y
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={nextMonth}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
        title="Bulan berikutnya"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
