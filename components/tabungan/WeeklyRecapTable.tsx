"use client";

import { formatCompactRupiah } from "@/lib/format";
import type { WeeklyRecapData } from "@/hooks/useWeeklyRecap";

interface WeeklyRecapTableProps {
  data: WeeklyRecapData[];
  loading: boolean;
}

export default function WeeklyRecapTable({ data, loading }: WeeklyRecapTableProps) {
  const cols = 4;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
      <table className="w-full">
        <thead>
          <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
            <th className="px-3 py-3 font-semibold whitespace-nowrap text-left">Tanggal</th>
            <th className="px-3 py-3 font-semibold whitespace-nowrap text-right">Setoran</th>
            <th className="px-3 py-3 font-semibold whitespace-nowrap text-right">Penarikan</th>
            <th className="px-3 py-3 font-semibold whitespace-nowrap text-right">Selisih</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {Array.from({ length: cols }).map((_, j) => (
                  <td key={j} className="px-3 py-3">
                    <div
                      className={`h-4 ${j === 0 ? "w-20" : "w-20 ml-auto"} bg-slate-200 dark:bg-slate-700 rounded`}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={cols}
                className="px-3 py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium"
              >
                Belum ada data tabungan 7 hari terakhir.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const diff = (row.recap?.deposits || 0) - (row.recap?.withdrawals || 0);
              const dateObj = new Date(row.date);
              
              return (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
                    {dateObj.toLocaleDateString("id-ID", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-emerald-600 font-semibold text-right">
                    + {formatCompactRupiah(row.recap?.deposits || 0)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-rose-600 font-semibold text-right">
                    - {formatCompactRupiah(row.recap?.withdrawals || 0)}
                  </td>
                  <td
                    className={`px-3 py-3 whitespace-nowrap text-sm font-bold text-right ${
                      diff > 0
                        ? "text-emerald-600"
                        : diff < 0
                        ? "text-rose-600"
                        : "text-slate-500"
                    }`}
                  >
                    {diff > 0 ? "+" : diff < 0 ? "-" : ""} {formatCompactRupiah(Math.abs(diff))}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
