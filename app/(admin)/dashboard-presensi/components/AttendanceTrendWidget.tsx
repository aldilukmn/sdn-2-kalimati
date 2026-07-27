"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import MobileWidgetWrapper from "@/components/common/MobileWidgetWrapper";
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

const AttendanceTrendChart = dynamic(() => import("@/components/charts/AttendanceTrendChart"), { ssr: false });

interface AttendanceTrendWidgetProps {
  isHarian: boolean;
  grade: string;
  initialDate: string; // YYYY-MM-DD
  initialYear: number;
}

export function AttendanceTrendWidget({
  isHarian,
  grade,
  initialDate,
  initialYear,
}: AttendanceTrendWidgetProps) {
  const defaultDate = new Date(initialDate);
  const [trendMonth, setTrendMonth] = useState(defaultDate.getMonth() + 1);
  const [trendYear, setTrendYear] = useState(isHarian ? defaultDate.getFullYear() : initialYear);

  // Sync state if mode changes significantly (optional, but good for UX)
  useEffect(() => {
    const d = new Date(initialDate);
    setTrendMonth(d.getMonth() + 1);
    setTrendYear(isHarian ? d.getFullYear() : initialYear);
  }, [isHarian, initialDate, initialYear]);

  return (
    <MobileWidgetWrapper
      title="Tren Kehadiran"
      icon={<TrendingUp size={16} className="text-indigo-500 dark:text-indigo-400" />}
      actionRight={
        <div className={`grid gap-2 w-full sm:w-auto ${isHarian ? 'grid-cols-2' : 'grid-cols-1'} sm:flex sm:items-center sm:justify-end`}>
          {isHarian && (
            <Select
              value={String(trendMonth)}
              onValueChange={(v) => v && setTrendMonth(Number(v))}
            >
              <SelectTrigger className="w-full sm:w-[130px] h-auto rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue>{MONTHS_ID[trendMonth - 1]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bulan</SelectLabel>
                  {MONTHS_ID.map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Select
            value={String(trendYear)}
            onValueChange={(v) => v && setTrendYear(Number(v))}
          >
            <SelectTrigger className="w-full sm:w-24 h-auto rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tahun</SelectLabel>
                {AVAILABLE_YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="mt-2">
        <AttendanceTrendChart 
          year={trendYear} 
          grade={grade} 
          month={isHarian ? trendMonth : undefined} 
        />
      </div>
    </MobileWidgetWrapper>
  );
}
