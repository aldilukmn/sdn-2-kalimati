"use client";

import Pagination from "@/components/common/Pagination";
import React from "react";

interface ScoreTableWrapperProps {
  loading: boolean;
  empty: boolean;
  emptyMessage?: string;
  totalPages?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  headers: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function ScoreTableWrapper({
  loading,
  empty,
  emptyMessage = "Tidak ada data.",
  totalPages = 0,
  totalItems = 0,
  currentPage = 1,
  onPageChange,
  itemsPerPage = 10,
  headers,
  children,
  footer,
}: ScoreTableWrapperProps) {
  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md: border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 flex flex-col gap-4">
      {loading ? (
        <div className="animate-pulse p-5 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          ))}
        </div>
      ) : empty ? (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                {headers}
              </tr>
            </thead>
            <tbody>
              {children}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && totalItems > 0 && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
      {footer}
    </div>
  );
}
