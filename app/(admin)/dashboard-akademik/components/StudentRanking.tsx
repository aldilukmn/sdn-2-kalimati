"use client";

import { Trophy, AlertTriangle, ArrowRight, ChevronDown } from "lucide-react";
import { StudentStat } from "@/services/academic-dashboard.service";
import Link from "next/link";
import { useState } from "react";

interface StudentRankingProps {
  topRajin: StudentStat[];
  bottomPerhatian: StudentStat[];
  loading: boolean;
}

export function StudentRanking({ topRajin, bottomPerhatian, loading }: StudentRankingProps) {
  const [rajinExpanded, setRajinExpanded] = useState(false);
  const [perhatianExpanded, setPerhatianExpanded] = useState(false);

  if (loading) {
    const skeleton = (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-pulse flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0"></div>
          <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-4 flex-1 flex flex-col justify-center hidden md:flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
              <div className="h-12 flex-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {skeleton}
        {skeleton}
      </div>
    );
  }

  const renderList = (
    title: string, 
    students: StudentStat[], 
    Icon: React.ElementType, 
    colorClass: string,
    emptyMessage: string,
    isExpanded: boolean,
    toggleExpanded: () => void
  ) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
      <div 
        onClick={toggleExpanded}
        className={`p-3 md:p-4 flex items-center justify-between gap-2 cursor-pointer md:cursor-default ${colorClass} ${
          isExpanded ? 'border-b border-slate-100 dark:border-slate-700/50' : 'md:border-b md:border-slate-100 md:dark:border-slate-700/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 md:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <h3 className="text-sm md:text-base font-bold text-white">{title}</h3>
        </div>
        <div className="md:hidden">
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-white transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </div>
      
      <div className={`flex-1 grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr] md:grid-rows-[1fr]"}`}>
        <div className="overflow-hidden min-h-0 flex flex-col h-full">
          <div className="p-0 flex-1 flex flex-col justify-center">
        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            {emptyMessage}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {students.map((student, idx) => (
              <li key={student.studentId} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'bg-amber-400 text-white dark:bg-amber-500 shadow-md border border-amber-500 dark:border-amber-400' : 
                  idx === 1 ? 'bg-slate-300 text-slate-700 dark:bg-slate-500 dark:text-white shadow-md border border-slate-400' :
                  idx === 2 ? 'bg-orange-700 text-white dark:bg-orange-600 shadow-md border border-orange-800 dark:border-orange-500' :
                  'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-white truncate">
                    {student.studentName}
                  </p>
                  <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Selesai: {student.completed}/{student.total}</span>
                    <span>Rerata: {Math.round(student.averageScore * 100) / 100}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    student.completionRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                    student.completionRate >= 50 ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {Math.floor(student.completionRate * 100) / 100}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {renderList(
        "Top 5 Paling Rajin",
        topRajin,
        Trophy,
        "bg-gradient-to-r from-emerald-500 to-teal-600",
        "Belum ada data nilai yang diinput.",
        rajinExpanded,
        () => setRajinExpanded(!rajinExpanded)
      )}
      
      {renderList(
        "Top 5 Perlu Perhatian",
        bottomPerhatian,
        AlertTriangle,
        "bg-gradient-to-r from-rose-500 to-orange-600",
        "Belum ada data nilai yang diinput.",
        perhatianExpanded,
        () => setPerhatianExpanded(!perhatianExpanded)
      )}
    </div>
  );
}
