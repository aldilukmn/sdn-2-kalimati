"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { RecapRow } from "@/hooks/useRekapKarakter";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import Pagination from "@/components/common/Pagination";

interface Props {
  recapRows: RecapRow[];
  monthsToShow: string[];
  classAverages: Record<string, number | null>;
  grade: string;
}

export default function RekapKarakterTable({ recapRows, monthsToShow, classAverages, grade }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(recapRows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = recapRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const showMonthColumns = monthsToShow.length > 1;

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
              <th className="px-3 py-3 text-center w-10">No</th>
              <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                Nama Siswa
              </th>
              {showMonthColumns ? (
                monthsToShow.map((m) => (
                  <th
                    key={m}
                    className="px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[90px]"
                  >
                    {m}
                  </th>
                ))
              ) : (
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[90px]">
                  Skor Karakter
                </th>
              )}
              {showMonthColumns && (
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[80px]">
                  Rerata
                </th>
              )}
              <th className="px-3 py-3 text-center font-semibold whitespace-nowrap w-20">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {paginatedRows.map((row, i) => (
              <tr
                key={row.studentId}
                className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                <td className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">
                  {startIndex + i + 1}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                    {row.name}
                  </span>
                </td>
                {showMonthColumns ? (
                  monthsToShow.map((m) => {
                    const score = row.monthlyScores[m];
                    return (
                      <td key={m} className="p-3 text-center">
                        <span
                          className={`text-sm font-semibold ${score !== null ? "text-gray-800 dark:text-gray-200" : "text-gray-300 dark:text-gray-600"}`}
                        >
                          {score !== null ? score.toFixed(2) : "-"}
                        </span>
                      </td>
                    );
                  })
                ) : (
                  <td className="p-3 text-center">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {row.studentAverage !== null
                        ? row.studentAverage.toFixed(2)
                        : "-"}
                    </span>
                  </td>
                )}
                {showMonthColumns && (
                  <td className="p-3 text-center">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {row.studentAverage !== null
                        ? row.studentAverage.toFixed(2)
                        : "-"}
                    </span>
                  </td>
                )}
                <td className="p-3 text-center">
                  <Link
                    href={`/penilaian-karakter/history?studentId=${row.studentId}&name=${encodeURIComponent(row.name)}&grade=${grade}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    <Eye size={14} />
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 dark:bg-gray-800/50 border-t-2 border-indigo-300 dark:border-indigo-700">
              <td className="px-3 py-3" />
              <td className="p-3 whitespace-nowrap">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Rerata Kelas
                </span>
              </td>
              {showMonthColumns ? (
                monthsToShow.map((m) => {
                  const avg = classAverages[m];
                  return (
                    <td key={m} className="p-3 text-center">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {avg !== null ? avg.toFixed(2) : "-"}
                      </span>
                    </td>
                  );
                })
              ) : (
                <td className="p-3 text-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {monthsToShow.length > 0 &&
                    classAverages[monthsToShow[0]] !== null
                      ? classAverages[monthsToShow[0]]!.toFixed(2)
                      : "-"}
                  </span>
                </td>
              )}
              {showMonthColumns && (
                <td className="p-3 text-center">
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    {(() => {
                      const validRows = recapRows.filter(
                        (r) => r.studentAverage !== null,
                      );
                      return validRows.length > 0
                        ? (
                            validRows.reduce(
                              (sum, r) => sum + r.studentAverage!,
                              0,
                            ) / validRows.length
                          ).toFixed(2)
                        : "-";
                    })()}
                  </span>
                </td>
              )}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={recapRows.length}
        />
      )}
    </div>
  );
}
