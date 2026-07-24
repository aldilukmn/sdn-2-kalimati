"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import type { ScoreEntry } from "@/types/nilai-harian";
import Pagination from "@/components/common/Pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants";

interface Props {
  entries: ScoreEntry[];
  paginatedEntries: ScoreEntry[];
  startIndex: number;
  currentPage: number;
  totalPages: number;
  saving: boolean;
  loading: boolean;
  onScoreChange: (studentId: string, value: string) => void;
  onMaxScoreChange: (studentId: string, value: string) => void;
  onPageChange: (page: number) => void;
  saveButton?: React.ReactNode;
  title?: string;
}

export default function ScoreTable({
  entries,
  paginatedEntries,
  startIndex,
  currentPage,
  totalPages,
  saving,
  loading,
  onScoreChange,
  onMaxScoreChange,
  onPageChange,
  saveButton,
  title,
}: Props) {
  const scoreRefs = useRef<Map<string, { score: HTMLInputElement | null; max: HTMLInputElement | null }>>(new Map());

  const getNextInput = useCallback((studentId: string, field: "score" | "max", direction: "next" | "prev") => {
    const keys = paginatedEntries.map((e) => e.studentId);
    const idx = keys.indexOf(studentId);
    if (idx === -1) return null;

    const currentRefs = scoreRefs.current.get(studentId);
    if (field === "score" && direction === "next") return currentRefs?.max ?? null;
    if (field === "max" && direction === "prev") return currentRefs?.score ?? null;

    const nextIdx = direction === "next" ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= keys.length) return null;
    const nextRefs = scoreRefs.current.get(keys[nextIdx]);
    if (!nextRefs) return null;
    return field === "score" ? nextRefs.score : direction === "next" ? nextRefs.score : nextRefs.max;
  }, [paginatedEntries]);

  const handleKeyDown = (studentId: string, field: "score" | "max", e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const next = getNextInput(studentId, field, e.shiftKey ? "prev" : "next");
      next?.focus();
      next?.select();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const next = getNextInput(studentId, field, "next");
      if (next) {
        next.focus();
        next?.select();
      }
    }
  };

  const setScoreInputRef = (studentId: string, el: HTMLInputElement | null) => {
    const refs = scoreRefs.current.get(studentId) ?? { score: null, max: null };
    refs.score = el;
    scoreRefs.current.set(studentId, refs);
  };

  const setMaxInputRef = (studentId: string, el: HTMLInputElement | null) => {
    const refs = scoreRefs.current.get(studentId) ?? { score: null, max: null };
    refs.max = el;
    scoreRefs.current.set(studentId, refs);
  };

  if (!loading && paginatedEntries.length === 0 && entries.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/40 md: border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl">
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
          Tidak ada murid di kelas ini
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md: border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
        <div className="overflow-x-auto  rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30 ">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm text-center">
                <th className="px-4 py-3 font-semibold w-12 whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Nama</th>
                <th className="px-4 py-3 font-semibold w-32 whitespace-nowrap">Nilai (0-100)</th>
                <th className="px-4 py-3 font-semibold w-24 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td colSpan={4} className="p-3">
                    <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const filledCount = entries.filter((e) => e.score !== "").length;
  const isComplete = filledCount === entries.length && entries.length > 0;

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden flex flex-col gap-4">
      {title && (
        <div className="flex flex-col gap-2 mb-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">
              Input Nilai: {title}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 w-fit">
              {filledCount}/{entries.length} Nilai ({entries.length > 0 ? Math.round((filledCount / entries.length) * 100) : 0}%)
            </span>
          </div>
          
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isComplete
                  ? "bg-emerald-500"
                  : filledCount > 0
                  ? "bg-amber-500"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
              style={{ width: `${entries.length > 0 ? (filledCount / entries.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
      {/* Desktop table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm text-center">
              <th className="px-4 py-3 font-semibold w-12 whitespace-nowrap">No</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Nama</th>
              <th className="px-4 py-3 font-semibold w-32 whitespace-nowrap">Nilai (0-100)</th>
              <th className="px-4 py-3 font-semibold w-24 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.map((entry, i) => (
              <tr
                key={entry.studentId}
                className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">
                  {startIndex + i + 1}
                </td>
                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap">
                  {entry.studentName}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <input
                    ref={(el) => setScoreInputRef(entry.studentId, el)}
                    type="number"
                    value={entry.score}
                    onChange={(e) => onScoreChange(entry.studentId, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(entry.studentId, "score", e)}
                    disabled={saving}
                    min={0}
                    max={Number(entry.maxScore)}
                    className="w-fit px-0 mx-auto block text-center rounded-lg border border-slate-300 bg-slate-50 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                  />
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold p-1.5 rounded-full ${
                      entry.status === "saved"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : entry.status === "error"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    }`}
                  >
                    {entry.status === "saved" && (
                      <span title="Tersimpan" className="inline-flex items-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                      </span>
                    )}
                    {entry.status === "unsaved" && (
                      <span title="Belum simpan" className="inline-flex items-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </span>
                    )}
                    {entry.status === "error" && (
                      <span title="Gagal" className="inline-flex items-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={entries.length}
        />
      )}

      {saveButton && <div className="mt-4">{saveButton}</div>}
    </div>
  );
}
