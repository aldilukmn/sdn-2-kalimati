"use client";

import Pagination from "@/app/components/Pagination";

interface TabNilaiHarianProps {
  paginatedStudents: Array<{ studentId: string; name: string }>;
  harianScores: Record<string, number | undefined>;
  harianLoading: boolean;
  handleScoreChange: (studentId: string, value: string) => void;
  ITEMS_PER_PAGE: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  totalStudents: number;
}

export default function TabNilaiHarian({
  paginatedStudents,
  harianScores,
  harianLoading,
  ITEMS_PER_PAGE,
  currentPage,
  totalPages,
  setCurrentPage,
  totalStudents,
}: TabNilaiHarianProps) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 flex flex-col gap-4">
      {harianLoading ? (
        <div className="animate-pulse p-5 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          ))}
        </div>
      ) : paginatedStudents.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">Tidak ada siswa.</div>
      ) : (
        <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-12">No</th>
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Nama Siswa</th>
                <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-32">Rata-rata Nilai Harian</th>
                <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-24">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((s, i) => {
                const scoreValue = harianScores[s.studentId];
                const hasScore = scoreValue !== undefined;
                return (
                <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                  <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{startIndex + i + 1}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{s.name}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {hasScore ? scoreValue!.toFixed(2) : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-flex items-center text-[11px] font-semibold p-1 rounded-full ${
                      hasScore
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    }`}>
                      {hasScore ? (
                        <span title="Ada" className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                        </span>
                      ) : (
                        <span title="Belum ada nilai" className="inline-flex items-center text-amber-600 dark:text-amber-400">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && totalStudents > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={totalStudents}
        />
      )}
    </div>
  );
}
