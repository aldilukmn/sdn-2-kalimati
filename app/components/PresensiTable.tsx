"use client";

import type { Entry } from "@/hooks/usePresensi";
import {
  STATUS_LABEL,
  STATUS_BTN,
  ITEMS_PER_PAGE,
} from "@/hooks/usePresensi";
import Pagination from "@/app/components/Pagination";

interface Props {
  paginatedEntries: Entry[];
  startIndex: number;
  syncing: boolean;
  totalPages: number;
  totalItems: number;
  currentPage: number;
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
  onPageChange,
  onStatusChange,
}: Props) {
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 dark:bg-gray-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 w-12">
                No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                Nama Siswa
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                Status Kehadiran
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
            {paginatedEntries.map((entry, i) => (
              <tr
                key={entry.studentId}
                className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {startIndex + i + 1}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {entry.name}
                </td>
                <td className="px-4 py-3">
                  {syncing ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5">
                      {STATUS_LIST.map((status) => (
                        <button
                          key={status}
                          onClick={() => onStatusChange(entry.studentId, status)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            entry.status === status
                              ? STATUS_BTN[status]
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
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

      {totalItems > ITEMS_PER_PAGE && (
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
    </>
  );
}
