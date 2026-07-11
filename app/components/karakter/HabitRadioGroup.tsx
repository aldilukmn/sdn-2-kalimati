"use client";

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
  return (
    <div className="flex gap-1 items-center justify-center">
      {OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
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
  );
}
