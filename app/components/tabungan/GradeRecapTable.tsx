"use client";

import { formatCompactRupiah } from "@/lib/format";
import type { GradeRecap } from "@/types/student-savings";

interface GradeRecapTableProps {
  data: GradeRecap[];
  loading: boolean;
  mode: "daily" | "monthly";
}

export default function GradeRecapTable({
  data,
  loading,
  mode,
}: GradeRecapTableProps) {
  const totalStudents = data.reduce((sum, g) => sum + g.totalStudents, 0);
  const totalDeposits = data.reduce((sum, g) => sum + g.deposits, 0);
  const totalWithdrawals = data.reduce((sum, g) => sum + g.withdrawals, 0);
  const totalBalance = data.reduce((sum, g) => sum + g.totalBalance, 0);
  const diff = totalDeposits - totalWithdrawals;

  const cols = 5;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
            <th className="px-3 py-3 font-semibold whitespace-nowrap">Kelas</th>
            <th className="px-3 py-3 font-semibold whitespace-nowrap">Siswa</th>
            <th className="px-3 py-3 font-semibold whitespace-nowrap">
              {mode === "daily" ? "Setoran" : "Saldo"}
            </th>
            <th className="px-3 py-3 font-semibold whitespace-nowrap">
              Penarikan
            </th>
            <th className="px-3 py-3 font-semibold whitespace-nowrap">
              Selisih
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {Array.from({ length: cols }).map((_, j) => (
                  <td key={j} className="px-3 py-3">
                    <div
                      className={`h-4 ${j === 0 ? "w-12" : "w-20 mx-auto"} bg-slate-200 dark:bg-slate-700 rounded`}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={cols}
                className="px-3 py-8 text-center text-gray-400"
              >
                Belum ada data tabungan
              </td>
            </tr>
          ) : (
            data.map((g) => {
              const selisih = g.deposits - g.withdrawals;

              return (
                <tr
                  key={g.grade}
                  className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors text-center"
                >
                  <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 whitespace-nowrap">
                    Kelas {g.grade}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {g.totalStudents}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                    {formatCompactRupiah(g.deposits)}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-red-700 dark:text-red-300 whitespace-nowrap">
                    {formatCompactRupiah(g.withdrawals)}
                  </td>
                  <td
                    className={`px-3 py-3 text-sm font-semibold whitespace-nowrap ${
                      selisih >= 0
                        ? "text-orange-700 dark:text-orange-300"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCompactRupiah(selisih)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        {!loading && data.length > 0 && (
          <tfoot>
            <tr className="bg-slate-100 dark:bg-gray-700/50 font-semibold text-center">
              <td className="px-3 py-3 text-sm text-gray-800 dark:text-slate-100 whitespace-nowrap">
                Total
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 dark:text-slate-100 whitespace-nowrap">
                {totalStudents}
              </td>
              <td className="px-3 py-3 text-sm text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                {formatCompactRupiah(totalDeposits)}
              </td>
              <td className="px-3 py-3 text-sm text-red-700 dark:text-red-300 whitespace-nowrap">
                {formatCompactRupiah(totalWithdrawals)}
              </td>
              <td
                className={`px-3 py-3 text-sm whitespace-nowrap ${
                  diff >= 0
                    ? "text-orange-700 dark:text-orange-300"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatCompactRupiah(diff)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
