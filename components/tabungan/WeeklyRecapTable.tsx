"use client";

import { useState, useEffect } from "react";
import { formatCompactRupiah } from "@/lib/format";
import type { WeeklyRecapData } from "@/hooks/useWeeklyRecap";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Wallet } from "lucide-react";
import Pagination from "@/components/common/Pagination";

interface WeeklyRecapTableProps {
  data: WeeklyRecapData[];
  monthlySummary?: { deposits: number; withdrawals: number };
  loading: boolean;
}

export default function WeeklyRecapTable({ data, monthlySummary, loading }: WeeklyRecapTableProps) {
  const cols = 6;
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out days with no transactions
  const filteredData = data.filter((row) => (row.recap?.deposits || 0) > 0 || (row.recap?.withdrawals || 0) > 0);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when data changes (e.g. date filter changes)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalDeposits = monthlySummary ? monthlySummary.deposits : filteredData.reduce((acc, row) => acc + (row.recap?.deposits || 0), 0);
  const totalWithdrawals = monthlySummary ? monthlySummary.withdrawals : filteredData.reduce((acc, row) => acc + (row.recap?.withdrawals || 0), 0);
  const totalDiff = totalDeposits - totalWithdrawals;

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30">
        <Table>
            <TableHeader>
              <TableRow className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                <TableHead className="w-10 text-center text-xs font-semibold text-white">No</TableHead>
                <TableHead className="text-xs font-semibold text-white">Tanggal</TableHead>
                <TableHead className="text-center text-xs font-semibold text-white">Penabung</TableHead>
                <TableHead className="text-center text-xs font-semibold text-white">Setoran</TableHead>
                <TableHead className="text-center text-xs font-semibold text-white">Penarikan</TableHead>
                <TableHead className="text-center text-xs font-semibold text-white">Selisih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    {Array.from({ length: cols }).map((_, j) => (
                      <TableCell key={j} className="text-center">
                        <div className="h-4 w-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={cols}
                    className="px-3 py-8 text-center text-slate-400 dark:text-slate-500 text-sm font-medium"
                  >
                    Belum ada data tabungan pada bulan ini.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, idx) => {
                  const diff = (row.recap?.deposits || 0) - (row.recap?.withdrawals || 0);
                  const dateObj = new Date(row.date);
                  const displayIdx = (currentPage - 1) * itemsPerPage + idx + 1;

                  return (
                    <TableRow
                      key={idx}
                      className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      <TableCell className="text-center text-xs text-slate-500 dark:text-slate-200">{displayIdx}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {/* Mobile view */}
                        <span className="md:hidden text-sm text-gray-800 dark:text-gray-200 font-medium">
                          {dateObj.toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </span>
                        {/* Desktop view */}
                        <span className="hidden md:inline text-xs md:text-sm text-gray-800 dark:text-gray-200 font-medium">
                          {dateObj.toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
                          {row.recap?.totalStudents || 0} murid
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-emerald-600">
                          + {formatCompactRupiah(row.recap?.deposits || 0)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-rose-600">
                          - {formatCompactRupiah(row.recap?.withdrawals || 0)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`text-sm font-medium ${
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
            {!loading && (filteredData.length > 0 || (totalDeposits > 0 || totalWithdrawals > 0)) && (
              <TableFooter className="bg-slate-100 dark:bg-slate-800/80">
                <TableRow>
                  <TableCell colSpan={3} className="text-right md:text-center pr-6 font-bold text-indigo-800 dark:text-indigo-300 text-xs md:text-sm">
                    Total Keseluruhan (Bulan Ini)
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-bold text-emerald-600">
                      + {formatCompactRupiah(totalDeposits)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-bold text-rose-600">
                      - {formatCompactRupiah(totalWithdrawals)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-sm font-bold ${
                        totalDiff > 0
                          ? "text-emerald-600"
                          : totalDiff < 0
                          ? "text-rose-600"
                          : "text-slate-500"
                      }`}
                    >
                      {totalDiff > 0 ? "+" : totalDiff < 0 ? "-" : ""} {formatCompactRupiah(Math.abs(totalDiff))}
                    </span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
        </Table>
      </div>
      
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
        />
      )}
    </div>
  );
}
