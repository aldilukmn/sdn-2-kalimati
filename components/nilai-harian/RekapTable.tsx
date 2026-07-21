"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Chapter, RekapEntry, ClassAverageItem } from "@/types/nilai-harian";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import Pagination from "@/components/common/Pagination";
import LoadingSkeleton from '../shared/LoadingSkeleton';

interface Props {
  chapters: Chapter[];
  entries: RekapEntry[];
  classAverages: ClassAverageItem[];
  loading: boolean;
}

export default function RekapTable({ chapters, entries, classAverages, loading }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = entries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleExpand = (studentId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const hasMaterialDetail = (entry: RekapEntry) =>
    Object.values(entry.materialDetails).some((details) => details.length > 0);

  if (loading) {
    return (
      <>
        <LoadingSkeleton rows={1} />
      </>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl">
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
          Belum ada data rekap untuk filter ini.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 ">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
              <th className="px-2 py-3 text-center w-8" />
              <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Nama</th>
              {chapters.map((ch) => (
                <th key={ch._id} className="px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[80px]">
                  {ch.name}
                  <span className="block text-[10px] font-normal opacity-75">
                    {ch.inputMode === "per_material" ? "Per Materi" : "Per Bab"}
                  </span>
                </th>
              ))}
              <th className="px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[80px]">
                Rerata
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {paginatedEntries.map((entry) => {
              const isExpanded = expanded.has(entry.studentId);
              const hasDetail = hasMaterialDetail(entry);
              return (
                <>
                  <tr
                    key={entry.studentId}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer"
                    onClick={() => hasDetail && toggleExpand(entry.studentId)}
                  >
                    <td className="px-2 py-3 text-center">
                      {hasDetail ? (
                        isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />
                      ) : (
                        <span className="w-3.5 inline-block" />
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                        {entry.studentName}
                      </span>
                    </td>
                    {chapters.map((ch) => (
                      <td key={ch._id} className="p-3 text-center">
                        <span className={`text-sm font-semibold ${
                          entry.chapterScores[ch._id] > 0
                            ? "text-gray-800 dark:text-gray-200"
                            : "text-gray-300 dark:text-gray-600"
                        }`}>
                          {entry.chapterScores[ch._id] > 0
                            ? entry.chapterScores[ch._id].toFixed(2)
                            : "-"}
                        </span>
                      </td>
                    ))}
                    <td className="p-3 text-center">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {entry.average > 0 ? entry.average.toFixed(2) : "-"}
                      </span>
                    </td>
                  </tr>
                  {/* Expanded per-material detail */}
                  {isExpanded && (
                    <tr key={`${entry.studentId}-detail`} className="bg-slate-50/50 dark:bg-gray-900/30">
                      <td colSpan={chapters.length + 3} className="p-0">
                        <div className="p-3 pl-10 space-y-1">
                          {chapters.map((ch) => {
                            const details = entry.materialDetails[ch._id];
                            if (!details || details.length === 0) return null;
                            return (
                              <div key={ch._id} className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{ch.name}:</span>{" "}
                                {details.map((d, i) => (
                                  <span key={i}>
                                    {d.materialName}={d.score}/{d.maxScore}
                                    {i < details.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
          {/* Footer: class averages */}
          <tfoot>
            <tr className="bg-slate-100 dark:bg-gray-800/50 border-t-2 border-indigo-300 dark:border-indigo-700">
              <td className="px-2 py-3" />
              <td className="p-3 whitespace-nowrap">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Rerata Kelas</span>
              </td>
              {chapters.map((ch) => {
                const ca = classAverages.find((a) => a.chapterId === ch._id);
                return (
                  <td key={ch._id} className="p-3 text-center">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {ca && ca.average > 0 ? ca.average.toFixed(2) : "-"}
                    </span>
                  </td>
                );
              })}
              <td className="p-3 text-center">
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                  {classAverages.find((a) => a.chapterId === "overall")?.average.toFixed(2) || "-"}
                </span>
              </td>
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
          totalItems={entries.length}
        />
      )}
    </div>
  );
}
