"use client";

import { formatCompactRupiah } from "@/lib/format";
import type { WeeklyRecapData } from "@/hooks/useWeeklyRecap";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet } from "lucide-react";

interface WeeklyRecapTableProps {
  data: WeeklyRecapData[];
  loading: boolean;
}

export default function WeeklyRecapTable({ data, loading }: WeeklyRecapTableProps) {
  const cols = 5;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30">
      <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <TableHead className="w-10 text-center text-xs font-semibold text-white">No</TableHead>
              <TableHead className="text-xs font-semibold text-white">Tanggal</TableHead>
              <TableHead className="text-center text-xs font-semibold text-white">Setoran</TableHead>
              <TableHead className="text-center text-xs font-semibold text-white">Penarikan</TableHead>
              <TableHead className="text-center text-xs font-semibold text-white">Selisih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  {Array.from({ length: cols }).map((_, j) => (
                    <TableCell key={j} className="text-center">
                      <div className="h-4 w-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={cols}
                  className="px-3 py-8 text-center text-slate-400 dark:text-slate-500 text-sm font-medium"
                >
                  Belum ada data tabungan 6 hari terakhir.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => {
                const diff = (row.recap?.deposits || 0) - (row.recap?.withdrawals || 0);
                const dateObj = new Date(row.date);

                return (
                  <TableRow
                    key={idx}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    <TableCell className="text-center text-xs text-slate-500">{idx + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                        {dateObj.toLocaleDateString("id-ID", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-bold text-emerald-600">
                        + {formatCompactRupiah(row.recap?.deposits || 0)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-bold text-rose-600">
                        - {formatCompactRupiah(row.recap?.withdrawals || 0)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`text-sm font-bold ${
                          diff > 0
                            ? "text-emerald-600"
                            : diff < 0
                            ? "text-rose-600"
                            : "text-slate-500"
                        }`}
                      >
                        {diff > 0 ? "+" : diff < 0 ? "-" : ""} {formatCompactRupiah(Math.abs(diff))}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
      </Table>
    </div>
  );
}
