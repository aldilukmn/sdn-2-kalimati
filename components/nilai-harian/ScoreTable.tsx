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
      <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl">
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
          Tidak ada murid di kelas ini
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
        <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                <th className="px-3 py-3 text-center font-semibold w-12 whitespace-nowrap">No</th>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Nama</th>
                <th className="px-3 py-3 text-center font-semibold w-24 whitespace-nowrap">Nilai</th>
                <th className="px-3 py-3 text-center font-semibold w-20 whitespace-nowrap">Maks</th>
                <th className="px-3 py-3 text-center font-semibold w-28 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-3 py-3"><div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto" /></td>
                  <td className="px-3 py-3"><div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                  <td className="px-3 py-3"><div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto" /></td>
                  <td className="px-3 py-3"><div className="h-8 w-14 bg-gray-200 dark:bg-gray-700 rounded mx-auto" /></td>
                  <td className="px-3 py-3"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
              <th className="px-3 py-3 text-center font-semibold w-12">No</th>
              <th className="px-3 py-3 text-left font-semibold">Nama</th>
              <th className="px-3 py-3 text-center font-semibold w-24">Nilai</th>
              <th className="px-3 py-3 text-center font-semibold w-20">Maks</th>
              <th className="px-3 py-3 text-center font-semibold w-28">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {paginatedEntries.map((entry, i) => (
              <tr
                key={entry.studentId}
                className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                <td className="p-3 text-sm text-gray-800 dark:text-gray-300 text-center">
                  {startIndex + i + 1}
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                    {entry.studentName}
                  </span>
                </td>
                <td className="p-3">
                  <input
                    ref={(el) => setScoreInputRef(entry.studentId, el)}
                    type="number"
                    value={entry.score}
                    onChange={(e) => onScoreChange(entry.studentId, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(entry.studentId, "score", e)}
                    disabled={saving}
                    min={0}
                    max={Number(entry.maxScore)}
                    className="w-fit px-1 py-1.5 text-sm text-center rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-blue-400 disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                  />
                </td>
                <td className="p-3">
                  <input
                    ref={(el) => setMaxInputRef(entry.studentId, el)}
                    type="number"
                    value={entry.maxScore}
                    readOnly
                    className="w-14 px-2 py-1.5 text-sm text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-gray-700/50 cursor-not-allowed opacity-70 [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                  />
                </td>
                <td className="p-3 text-center">
                  {entry.status === "saved" && (
                    <span title="Tersimpan" className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    </span>
                  )}
                  {entry.status === "unsaved" && (
                    <span title="Belum simpan" className="inline-flex items-center text-amber-600 dark:text-amber-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </span>
                  )}
                  {entry.status === "error" && (
                    <span title="Gagal" className="inline-flex items-center text-red-600 dark:text-red-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2 animate-fadeIn">
        {paginatedEntries.map((entry, i) => (
          <div
            key={entry.studentId}
            className="bg-white/80 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                #{startIndex + i + 1}
              </span>
              {entry.status === "saved" && <span title="Tersimpan" className="inline-flex items-center text-emerald-600 dark:text-emerald-400"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></span>}
              {entry.status === "unsaved" && <span title="Belum simpan" className="inline-flex items-center text-amber-600 dark:text-amber-400"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>}
              {entry.status === "error" && <span title="Gagal" className="inline-flex items-center text-red-600 dark:text-red-400"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></span>}
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">{entry.studentName}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Nilai</label>
                <input
                  ref={(el) => setScoreInputRef(entry.studentId, el)}
                  type="number"
                  value={entry.score}
                  onChange={(e) => onScoreChange(entry.studentId, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(entry.studentId, "score", e)}
                  disabled={saving}
                  min={0}
                  max={Number(entry.maxScore)}
                  className="w-full px-2 py-1.5 text-sm text-center rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-blue-400 disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                />
              </div>
              <div className="w-20">
                <label className="block text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Maks</label>
                <input
                  ref={(el) => setMaxInputRef(entry.studentId, el)}
                  type="number"
                  value={entry.maxScore}
                  readOnly
                  className="w-full px-2 py-1.5 text-sm text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-gray-700/50 cursor-not-allowed opacity-70 [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                />
              </div>
            </div>
          </div>
        ))}
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
