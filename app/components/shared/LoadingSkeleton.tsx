"use client";

interface LoadingSkeletonProps {
  type?: "bars" | "pulse-table";
  rows?: number;
  rowHeight?: string;
  className?: string;
}

export default function LoadingSkeleton({
  type = "bars",
  rows = 3,
  rowHeight = "h-14",
  className = "",
}: LoadingSkeletonProps) {
  if (type === "pulse-table") {
    return (
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
        <div className={`animate-pulse ${className}`}>
          <div className="h-10 bg-slate-200 dark:bg-slate-700" />
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${rowHeight} bg-slate-200 dark:bg-slate-700 rounded-xl`} />
      ))}
    </div>
  );
}
