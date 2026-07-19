"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface HabitRadioGroupProps {
  value: string;
  onChange: (value: "A" | "B" | "C" | "D") => void;
  disabled?: boolean;
}

const OPTIONS = [
  { value: "A" as const, label: "A", className: "bg-emerald-500 hover:bg-emerald-600 ring-emerald-400" },
  { value: "B" as const, label: "B", className: "bg-blue-500 hover:bg-blue-600 ring-blue-400" },
  { value: "C" as const, label: "C", className: "bg-amber-500 hover:bg-amber-600 ring-amber-400" },
  { value: "D" as const, label: "D", className: "bg-red-500 hover:bg-red-600 ring-red-400" },
];

export default function HabitRadioGroup({ value, onChange, disabled }: HabitRadioGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  const setRef = useCallback((el: HTMLButtonElement | null, idx: number) => {
    if (el) buttonRefs.current[idx] = el;
  }, []);

  useEffect(() => {
    if (!isExpanded) return;
    const focusIdx = OPTIONS.findIndex((o) => o.value === value);
    const target = buttonRefs.current[focusIdx >= 0 ? focusIdx : 0];
    if (target) target.focus();
  }, [isExpanded, value]);

  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const focusNext = (currentIdx: number, direction: 1 | -1) => {
    const nextIdx = (currentIdx + direction + OPTIONS.length) % OPTIONS.length;
    buttonRefs.current[nextIdx]?.focus();
    onChange(OPTIONS[nextIdx].value);
  };

  const handleKeyDown = (idx: number) => (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusNext(idx, -1);
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusNext(idx, 1);
        break;
      case "Escape":
        e.preventDefault();
        setIsExpanded(false);
        containerRef.current?.querySelector("button")?.focus();
        break;
    }
  };

  const selectedOpt = OPTIONS.find((o) => o.value === value);

  const handleSelect = (optValue: "A" | "B" | "C" | "D") => {
    onChange(optValue);
    setIsExpanded(false);
  };

  return (
    <div ref={containerRef} className="inline-flex items-center justify-center">
      {isExpanded ? (
        <div className="flex gap-1 items-center animate-fadeIn" role="radiogroup" aria-label="Nilai kebiasaan">
          {OPTIONS.map((opt, idx) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                ref={(el) => setRef(el, idx)}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                tabIndex={selected || idx === 0 ? 0 : -1}
                onClick={() => handleSelect(opt.value)}
                onKeyDown={handleKeyDown(idx)}
                aria-label={`Nilai ${opt.value}`}
                className={`w-7 h-7 rounded-full text-xs font-bold text-white transition-all duration-200 shrink-0 ${
                  selected
                    ? opt.className + " ring-2 ring-offset-1 ring-offset-slate-50 dark:ring-offset-slate-800 scale-110"
                    : "bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-500"
                } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsExpanded(true)}
          aria-label="Pilih nilai kebiasaan"
          className={`w-7 h-7 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
            selectedOpt
              ? selectedOpt.className + " text-slate-200 ring-2 ring-offset-1 ring-offset-slate-50 dark:ring-offset-slate-800"
              : "bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-500"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-110"}`}
        >
          {selectedOpt ? selectedOpt.label : "-"}
        </button>
      )}
    </div>
  );
}
