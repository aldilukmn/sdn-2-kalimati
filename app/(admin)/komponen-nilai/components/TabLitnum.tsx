"use client";

import ScoreTableWrapper from "@/app/components/shared/ScoreTableWrapper";

interface TabLitnumProps {
  paginatedLitnumStudents: Array<{ studentId: string; name: string; avg: number | null }>;
  litnumLoading: boolean;
  ITEMS_PER_PAGE: number;
  currentPage: number;
  litnumTotalPages: number;
  setCurrentPage: (page: number) => void;
  totalLitnumStudents: number;
}

export default function TabLitnum({
  paginatedLitnumStudents,
  litnumLoading,
  ITEMS_PER_PAGE,
  currentPage,
  litnumTotalPages,
  setCurrentPage,
  totalLitnumStudents,
}: TabLitnumProps) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const headers = (
    <>
      <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-12">No</th>
      <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Nama Siswa</th>
      <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-40">Rata-rata LitNum</th>
      <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-24">Status</th>
    </>
  );

  return (
    <ScoreTableWrapper
      loading={litnumLoading}
      empty={paginatedLitnumStudents.length === 0}
      emptyMessage="Belum ada data Literasi & Numerasi untuk kelas ini."
      totalPages={litnumTotalPages}
      totalItems={totalLitnumStudents}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      itemsPerPage={ITEMS_PER_PAGE}
      headers={headers}
    >
      {paginatedLitnumStudents.map((s, i) => (
        <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
          <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{startIndex + i + 1}</td>
          <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{s.name}</td>
          <td className="px-4 py-2.5 text-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {s.avg !== null ? s.avg.toFixed(2) : "-"}
            </span>
          </td>
          <td className="px-4 py-2.5 text-center">
            <span className={`inline-flex items-center text-[11px] font-semibold p-1 rounded-full ${
              s.avg !== null
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            }`}>
              {s.avg !== null ? (
                <span title="Ada" className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </span>
              ) : (
                <span title="Belum ada data" className="inline-flex items-center text-amber-600 dark:text-amber-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </span>
              )}
            </span>
          </td>
        </tr>
      ))}
    </ScoreTableWrapper>
  );
}
