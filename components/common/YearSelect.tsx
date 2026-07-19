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

interface YearSelectProps {
  value: number;
  onChange: (year: number) => void;
  years?: number[];
  compact?: boolean;
}

const DEFAULT_YEARS = [2026, 2027];

export default function YearSelect({ value, onChange, years, compact }: YearSelectProps) {
  const yearList = years || DEFAULT_YEARS;
  return (
    <Select
      value={String(value)}
      onValueChange={(v) => {
        if (v !== null) onChange(Number(v));
      }}
    >
      <SelectTrigger
        className={`h-auto rounded-lg border border-slate-300 bg-slate-50 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 ${
          compact ? "px-2 py-1 w-[70px]" : "px-3 py-1.5 w-[80px]"
        }`}
      >
        <SelectValue placeholder="Tahun" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tahun</SelectLabel>
          {yearList.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
