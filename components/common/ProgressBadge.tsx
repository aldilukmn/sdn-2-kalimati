import React from "react";

interface ProgressBadgeProps {
  completed: number;
  total: number;
  label?: string;
  className?: string;
}

export default function ProgressBadge({ 
  completed, 
  total, 
  label = "murid",
  className = "" 
}: ProgressBadgeProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className={`relative overflow-hidden rounded-md border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800 px-3 py-1 shadow-sm shrink-0 flex items-center justify-center ${className}`}>
      <span className="relative z-10 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 tracking-wide">
        {completed}/{total} {label} ({percentage}%)
      </span>
      <div 
        className="absolute bottom-0 left-0 h-[3px] bg-emerald-500 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
