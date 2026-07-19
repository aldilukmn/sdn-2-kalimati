"use client";

import { Save } from "lucide-react";
import type { AssessmentComponent } from "@/types/nilai-harian";
import ScoreTableWrapper from "@/components/shared/ScoreTableWrapper";

interface TabNonHarianProps {
  nonHarianComponents: AssessmentComponent[];
  selectedComponentKey: string;
  setSelectedComponentKey: (key: string) => void;
  paginatedStudents: Array<{ studentId: string; name: string }>;
  nonHarianScores: Record<string, { score?: string; status?: string } | undefined>;
  nonHarianLoading: boolean;
  handleScoreChange: (studentId: string, value: string) => void;
  ITEMS_PER_PAGE: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  selectedGS: string;
  getTabColor: (index: number) => string;
  saving: boolean;
  onSave: () => Promise<void>;
  totalStudents: number;
}

export default function TabNonHarian({
  paginatedStudents,
  nonHarianScores,
  nonHarianLoading,
  handleScoreChange,
  ITEMS_PER_PAGE,
  currentPage,
  totalPages,
  setCurrentPage,
  selectedComponentKey,
  nonHarianComponents,
  onSave,
  saving,
  totalStudents,
}: TabNonHarianProps) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const headers = (
    <>
      <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-12">No</th>
      <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Nama Siswa</th>
      <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-40">
        {nonHarianComponents.find((c) => c.key === selectedComponentKey)?.name || selectedComponentKey}
      </th>
      <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-28">Status</th>
    </>
  );

  const footer = (
    <button
      onClick={onSave}
      disabled={saving || nonHarianLoading || totalStudents === 0}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors cursor-pointer w-full"
    >
      {saving ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Save size={16} />
      )}
      {saving ? "Menyimpan..." : "Simpan Semua"}
    </button>
  );

  return (
    <ScoreTableWrapper
      loading={nonHarianLoading}
      empty={paginatedStudents.length === 0}
      emptyMessage="Tidak ada siswa."
      totalPages={totalPages}
      totalItems={totalStudents}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      itemsPerPage={ITEMS_PER_PAGE}
      headers={headers}
      footer={footer}
    >
      {paginatedStudents.map((s, i) => {
        const entry = nonHarianScores[s.studentId];
        const score = entry?.score || "";
        const status = entry?.status || "unsaved";
        return (
          <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
            <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{startIndex + i + 1}</td>
            <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{s.name}</td>
            <td className="px-4 py-2.5 text-center">
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => handleScoreChange(s.studentId, e.target.value)}
                className="w-fit px-0 py-1.5 text-center rounded-lg border border-slate-300 bg-slate-50 dark:border-gray-700 dark:bg-gray-950 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
              />
            </td>
            <td className="px-4 py-2.5 text-center">
              <span className={`inline-flex items-center text-[11px] font-semibold p-1 rounded-full ${
                status === "saved"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
              }`}>
                {status === "saved" ? (
                  <span title="Tersimpan" className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  </span>
                ) : (
                  <span title="Belum simpan" className="inline-flex items-center text-amber-600 dark:text-amber-400">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </span>
                )}
              </span>
            </td>
          </tr>
        );
      })}
    </ScoreTableWrapper>
  );
}
