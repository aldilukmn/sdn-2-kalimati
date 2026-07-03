"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  format,
  addDays,
  subDays,
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
}

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function DateDayPicker({ value, onChange, max }: DateDayPickerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const current = parseISO(value);
  const formatted = format(current, "EEEE, dd MMMM yyyy", { locale: id });

  const [viewDate, setViewDate] = useState(current);

  useEffect(() => {
    setViewDate(current);
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

  const prevDay = () => {
    const prev = subDays(current, 1);
    onChange(format(prev, "yyyy-MM-dd"));
  };

  const nextDay = () => {
    const next = addDays(current, 1);
    const nextStr = format(next, "yyyy-MM-dd");
    if (max && nextStr > max) return;
    onChange(nextStr);
  };

  const canGoNext = !max || value < max;

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { locale: id });
  const calEnd = endOfWeek(monthEnd, { locale: id });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const maxDate = max ? parseISO(max) : null;

  return (
    <div className="flex items-center gap-2 z-10">
      <button
        type="button"
        onClick={prevDay}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
        title="Hari sebelumnya"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="relative flex-1" ref={panelRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-2.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:ring-blue-200 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-500 cursor-pointer"
        >
          <CalendarDays size={18} className="shrink-0 text-blue-500" />
          <span className="font-medium">{formatted}</span>
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
                const isSelected = isSameDay(day, current);
                const inMonth = isSameMonth(day, viewDate);
                const today = isToday(day);
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
                    className={`rounded-lg py-1.5 text-xs font-medium transition-colors cursor-pointer
                      ${!inMonth ? "text-slate-300 dark:text-gray-700" : ""}
                      ${isSelected ? "bg-blue-600 text-white" : ""}
                      ${!isSelected && inMonth && !disabled ? "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-gray-800" : ""}
                      ${today && !isSelected ? "ring-1 ring-blue-400" : ""}
                      ${disabled ? "opacity-30 cursor-not-allowed" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={nextDay}
        disabled={!canGoNext}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
        title="Hari berikutnya"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
