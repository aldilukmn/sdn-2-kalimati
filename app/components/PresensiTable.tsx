"use client";

import type { Entry } from "@/hooks/usePresensi";
import { STATUS_LABEL, STATUS_BTN, ITEMS_PER_PAGE } from "@/hooks/usePresensi";
import Pagination from "@/app/components/Pagination";

interface Props {
  paginatedEntries: Entry[];
  startIndex: number;
  syncing: boolean;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onStatusChange: (studentId: string, status: Entry["status"]) => void;
}

const STATUS_LIST = ["hadir", "sakit", "izin", "alpha"] as const;

export default function PresensiTable({
  paginatedEntries,
  startIndex,
  syncing,
  totalPages,
  totalItems,
  currentPage,
  loading,
  onPageChange,
  onStatusChange,
}: Props) {
  if (!loading && totalItems === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl">
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
          Tidak ada siswa di kelas ini
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-700 text-indigo-50 tracking-wider text-xs md:text-sm">
              <th className="px-4 py-3 text-left font-semibold w-12">No</th>
              <th className="px-4 py-3 text-left font-semibold">Nama</th>
              <th className="px-4 py-3 text-center font-semibold">Kehadiran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              : paginatedEntries.map((entry, i) => (
                  <tr
                    key={entry.studentId}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors animate-fadeInUp"
                  >
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-300 text-center">
                      {startIndex + i + 1}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                          {entry.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      {syncing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          {STATUS_LIST.map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                onStatusChange(entry.studentId, status)
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                entry.status === status
                                  ? STATUS_BTN[status]
                                  : "bg-gray-100/70 text-gray-500 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700"
                              }`}
                            >
                              {STATUS_LABEL[status]}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && totalItems > ITEMS_PER_PAGE && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
}
