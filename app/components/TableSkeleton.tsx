"use client";

interface TableSkeletonProps {
  headers: string[];
  rows?: number;
  className?: string;
  children?: (rowIndex: number) => React.ReactNode;
}

export default function TableSkeleton({
  headers,
  rows = 5,
  className = "",
  children,
}: TableSkeletonProps) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700 ${className}`}
    >
      <table className="w-full">
        <thead>
          <tr className="bg-slate-100 dark:bg-gray-800 texce">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full mx-auto">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="animate-pulse">
              {children
                ? children(rowIdx)
                : headers.map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </td>
                  ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
