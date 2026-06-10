"use client";

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerFieldProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DatePickerField({
  label,
  name,
  required = false,
  placeholder = "Pilih Tanggal Lahir",
  value,
  onChange,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Convert string (YYYY-MM-DD) to Date object for DayPicker
  const selectedDate = value ? new Date(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format as YYYY-MM-DD to match native date input format
      const dateString = format(date, "yyyy-MM-dd");

      // Create a fake event
      const fakeEvent = {
        target: {
          name,
          value: dateString,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(fakeEvent);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-sm font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 transition flex items-center justify-between cursor-pointer"
      >
        <span>
          {value
            ? format(selectedDate!, "dd MMMM yyyy", { locale: id })
            : placeholder}
        </span>
        <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>

      {isOpen && (
        <div
          id="bg-date-picker"
          className="absolute top-full mt-2 z-50 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4"
        >
          <style>{`
            .rdp-root {
              --rdp-accent-color: #2563eb;
              --rdp-background-color: #eff6ff;
            }
            .dark .rdp-root {
              --rdp-accent-color: #3b82f6;
              --rdp-background-color: #1e3a8a;
              color: white;
            }
            .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: #1e293b;
            }
            .dark .rdp-day_selected {
              background-color: var(--rdp-accent-color);
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            captionLayout="dropdown"
            startMonth={new Date(1950, 0)}
            endMonth={new Date(new Date().getFullYear(), 11)}
            locale={id}
            classNames={{
              day: "hover:bg-blue-100 hover:text-blue-700 rounded-md transition",
              selected:
                "bg-blue-600 text-white hover:text-white hover:bg-blue-700",
              today: "text-red-500 font-bold",
            }}
          />
        </div>
      )}
    </div>
  );
}
