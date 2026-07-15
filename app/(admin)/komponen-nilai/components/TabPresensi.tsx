"use client";

import Pagination from "@/app/components/Pagination";

interface TabPresensiProps {
  paginatedPresensiStudents: Array<{ studentId: string; name: string; avg: number | null }>;
  presensiLoading: boolean;
  ITEMS_PER_PAGE: number;
  currentPage: number;
  presensiTotalPages: number;
  setCurrentPage: (page: number) => void;
  totalPresensiStudents: number;
}

export default function TabPresensi({
  paginatedPresensiStudents,
  presensiLoading,
  ITEMS_PER_PAGE,
  currentPage,
  presensiTotalPages,
  setCurrentPage,
  totalPresensiStudents,
}: TabPresensiProps) {
  const presensiStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
      {presensiLoading ? (
        <div className="animate-pulse p-5 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          ))}
        </div>
      ) : paginatedPresensiStudents.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
          Belum ada data presensi untuk kelas ini.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-12 whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Nama Siswa</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-40 whitespace-nowrap">Rata-rata Presensi</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-24 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPresensiStudents.map((s, i) => (
                <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{presensiStartIndex + i + 1}</td>
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
            </tbody>
          </table>
        </div>
      )}
      {presensiTotalPages > 1 && totalPresensiStudents > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={presensiTotalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={totalPresensiStudents}
        />
      )}
    </div>
  );
}
