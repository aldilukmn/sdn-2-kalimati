"use client";

import Pagination from "@/app/components/Pagination";
import YearSelect from "@/app/components/YearSelect";
import LoadingDots from "@/app/components/LoadingDots";
import { formatCompactRupiah } from "@/lib/format";
import { StudentWithBalance } from "@/hooks/useStudentList";

interface MonthlyTabProps {
  monthlyLoading: boolean;
  monthlyData: any[];
  monthlyPaginated: any[];
  monthlyPage: number;
  setMonthlyPage: (page: number) => void;
  monthlyTotalPages: number;
  MONTHLY_PER_PAGE: number;
  year: number;
  setYear: (y: number) => void;
  openHistoryModal: (student: StudentWithBalance, type?: string, allTime?: boolean) => void;
  closeHistoryModal: () => void;
}

export default function MonthlyTab({
  monthlyLoading,
  monthlyData,
  monthlyPaginated,
  monthlyPage,
  setMonthlyPage,
  monthlyTotalPages,
  MONTHLY_PER_PAGE,
  year,
  setYear,
  openHistoryModal,
  closeHistoryModal,
}: MonthlyTabProps) {
  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
          Rekap Tabungan Bulanan
        </h2>
        <div className="flex items-center gap-2.5">
          <YearSelect value={year} onChange={setYear} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
              <th className="px-2 py-2.5 text-left font-semibold">No</th>
              <th className="px-2 py-2.5 text-left font-semibold whitespace-nowrap">Nama</th>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i} className="px-2 py-2.5 text-center font-semibold min-w-[60px] whitespace-nowrap">
                  {String(i + 1).padStart(2, "0")}
                </th>
              ))}
              <th className="px-2 py-2.5 text-center font-semibold min-w-[70px] whitespace-nowrap">Saldo</th>
              <th className="px-2 py-2.5 text-center font-semibold min-w-[50px] whitespace-nowrap">Tarik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {monthlyLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-2 py-2.5"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-6" /></td>
                  <td className="px-2 py-2.5"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" /></td>
                  {Array.from({ length: 14 }).map((_, j) => (
                    <td key={j} className="px-2 py-2.5"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12 mx-auto" /></td>
                  ))}
                </tr>
              ))
            ) : monthlyData.length === 0 ? (
              <tr>
                <td colSpan={16} className="px-3 py-12 text-center text-gray-400">
                  Belum ada data tabungan untuk tahun {year}
                </td>
              </tr>
            ) : (
              monthlyPaginated.map((s, i) => {
                const monthsTotal = Object.values(s.months).reduce<number>((a, b) => a + Number(b), 0);
                return (
                  <tr key={s.studentId} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                    <td className="px-2 py-2.5 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {(monthlyPage - 1) * MONTHLY_PER_PAGE + i + 1}
                    </td>
                    <td className="px-2 py-2.5 text-sm font-medium text-gray-800 dark:text-slate-100 whitespace-nowrap">
                      {s.name}
                    </td>
                    {Array.from({ length: 12 }, (_, mi) => {
                      const monthKey = String(mi + 1).padStart(2, "0");
                      const val = s.months[monthKey];
                      return (
                        <td key={mi} className="px-2 py-2.5 text-xs md:text-sm text-center font-medium whitespace-nowrap">
                          {val ? (
                            <span className="text-emerald-700 dark:text-emerald-300">{formatCompactRupiah(val)}</span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-2 py-2.5 text-xs md:text-sm text-center font-semibold text-gray-800 dark:text-slate-100 whitespace-nowrap">
                      {formatCompactRupiah(s.balance)}
                    </td>
                    <td className="px-2 py-2.5 text-center whitespace-nowrap">
                      {s.totalWithdrawn > 0 ? (
                        <button
                          onClick={() => {
                            closeHistoryModal();
                            openHistoryModal(
                              {
                                studentId: s.studentId,
                                name: s.name,
                                grade: s.grade,
                                balance: s.balance,
                                todayDeposit: 0,
                                todayWithdrawal: 0,
                              },
                              "tarik",
                              true,
                            );
                          }}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors cursor-pointer text-xs md:text-sm font-semibold underline decoration-dotted underline-offset-2"
                          title="Lihat riwayat penarikan"
                        >
                          {formatCompactRupiah(s.totalWithdrawn)}
                        </button>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 text-xs md:text-sm">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!monthlyLoading && monthlyData.length > 0 && (
        <>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
            Menampilkan total setoran per bulan. Tanda (-) berarti tidak ada setoran.
          </p>
          <Pagination
            currentPage={monthlyPage}
            totalPages={monthlyTotalPages}
            onPageChange={setMonthlyPage}
            totalItems={monthlyData.length}
            itemsPerPage={MONTHLY_PER_PAGE}
          />
        </>
      )}
    </div>
  );
}
