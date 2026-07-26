"use client";

import { ComponentStat } from "@/services/academic-dashboard.service";
import { BarChart2, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ComponentBreakdownProps {
  components:
    | {
        harian: ComponentStat;
        tugas: ComponentStat;
        keaktifan: ComponentStat;
        partisipasi: ComponentStat;
        litnum: ComponentStat;
      }
    | undefined;
  loading: boolean;
}

export function ComponentBreakdown({
  components,
  loading,
}: ComponentBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-pulse flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0"></div>
          <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-4 flex-1 flex flex-col justify-center hidden md:flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-100 dark:bg-slate-700/50 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const items = [
    {
      key: "harian",
      label: "Nilai Harian",
      data: components?.harian,
      color: "bg-blue-500",
    },
    {
      key: "tugas",
      label: "Tugas",
      data: components?.tugas,
      color: "bg-indigo-500",
    },
    {
      key: "keaktifan",
      label: "Keaktifan",
      data: components?.keaktifan,
      color: "bg-emerald-500",
    },
    {
      key: "partisipasi",
      label: "Partisipasi",
      data: components?.partisipasi,
      color: "bg-amber-500",
    },
    {
      key: "litnum",
      label: "Literasi & Numerasi",
      data: components?.litnum,
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-3 md:p-4 flex items-center justify-between gap-2 bg-indigo-500 cursor-pointer md:cursor-default ${
          isExpanded ? 'border-b border-slate-100 dark:border-slate-700/50' : 'md:border-b md:border-slate-100 md:dark:border-slate-700/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 md:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <h3 className="text-sm md:text-base font-bold text-white">Breakdown per Komponen</h3>
        </div>
        <div className="md:hidden">
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-white transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      <div className={`flex-1 grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr] md:grid-rows-[1fr]"}`}>
        <div className="overflow-hidden min-h-0 flex flex-col h-full">
          <div className="p-6 space-y-6 flex-1 flex flex-col justify-center">
        {items.map((item) => {
          const rateRaw =
            item.data && item.data.possible > 0
              ? (item.data.filled / item.data.possible) * 100
              : 0;
          const rate = Math.floor(rateRaw * 100) / 100;

          return (
            <div key={item.key} className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.data?.items ?? 0} item penilaian • Rerata:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {Math.round((item.data?.avgScore ?? 0) * 100) / 100}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {rate}%
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.data?.filled ?? 0} / {item.data?.possible ?? 0}
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${rate}%` }}
                ></div>
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
}
