"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface DateDayPickerProps {
  value: string;
  onChange: (date: string) => void;
  max?: string;
  blockedDates?: string[];
}

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function DateDayPicker({
  value,
  onChange,
  max,
  blockedDates,
}: DateDayPickerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const current = value ? parseISO(value) : null;
  const formatted = current
    ? format(current, "EEEE, d MMMM yyyy", { locale: id })
    : "Pilih tanggal";

  const [viewDate, setViewDate] = useState(current || new Date());

  useEffect(() => {
    if (current) setViewDate(current);
  }, [value]);

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

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { locale: id });
  const calEnd = endOfWeek(monthEnd, { locale: id });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const maxDate = max ? parseISO(max) : null;

  return (
    <div className="flex items-center gap-2 z-10">
      <div className="relative flex-1" ref={panelRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-2.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:ring-blue-200 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-500 cursor-pointer"
        >
          <CalendarDays size={18} className="shrink-0 text-blue-500" />
          <span
            className={`font-medium ${current ? "" : "text-gray-400 dark:text-gray-500"} text-xs md:text-sm`}
          >
            {formatted}
          </span>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 my-2 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewDate(subMonths(viewDate, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 capitalize">
                {format(viewDate, "MMMM yyyy", { locale: id })}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(addMonths(viewDate, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              {DAYS.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const isSelected = current && isSameDay(day, current);
                const inMonth = isSameMonth(day, viewDate);
                const today = isToday(day);
                const isSunday = day.getDay() === 0;
                const blocked = blockedDates?.includes(dayStr) || isSunday;
                const disabled = maxDate && day > maxDate;

                return (
                  <button
                    key={dayStr}
                    type="button"
                    disabled={!!disabled}
                    onClick={() => {
                      onChange(dayStr);
                      setOpen(false);
                    }}
                    className={`rounded py-1.5 text-xs font-medium transition-colors cursor-pointer
                      ${!inMonth ? "text-slate-300 dark:text-gray-700" : ""}
                      ${isSelected ? "bg-blue-600 text-white" : ""}
                      ${!isSelected && inMonth && !disabled ? "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-gray-800" : ""}
                      ${today && !isSelected ? "ring-1 ring-blue-400" : ""}
                      ${disabled ? "opacity-30 cursor-not-allowed" : ""}
                      ${blocked && !isSelected ? "!text-red-600 dark:!text-red-600 font-semibold hover:bg-red-100 dark:hover:bg-red-900/40" : ""} 
                    `}
                    title={blocked ? "Hari Libur" : undefined}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
