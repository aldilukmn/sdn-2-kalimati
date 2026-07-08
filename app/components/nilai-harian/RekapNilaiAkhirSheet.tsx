"use client";

import type { SubjectColumn, MatrixRow } from "@/hooks/useRekapNilaiAkhir";

interface Props {
  matrix: MatrixRow[];
  subjects: SubjectColumn[];
  classAverages: Record<string, number | null>;
}

export default function RekapNilaiAkhirSheet({ matrix, subjects, classAverages }: Props) {
  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
              <th className="px-3 py-3 text-center w-10">No</th>
              <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Nama Siswa</th>
              {subjects.map((subj) => (
                <th
                  key={subj.subjectId}
                  className="px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[90px]"
                >
                  {subj.subjectName}
                </th>
              ))}
              <th className="px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[80px]">
                Rata-rata
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {matrix.map((row, idx) => (
              <tr
                key={row.studentId}
                className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                <td className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">
                  {idx + 1}
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                    {row.studentName}
                  </span>
                </td>
                {subjects.map((subj) => {
                  const score = row.scores[subj.subjectId];
                  return (
                    <td key={subj.subjectId} className="p-3 text-center">
                      <span
                        className={`text-sm font-semibold ${
                          score !== null
                            ? "text-gray-800 dark:text-gray-200"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      >
                        {score !== null ? score.toFixed(1) : "-"}
                      </span>
                    </td>
                  );
                })}
                <td className="p-3 text-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {row.average !== null ? row.average.toFixed(1) : "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Footer: class averages */}
          <tfoot>
            <tr className="bg-slate-100 dark:bg-gray-800/50 border-t-2 border-indigo-300 dark:border-indigo-700">
              <td className="px-3 py-3" />
              <td className="p-3">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Rata-rata Kelas
                </span>
              </td>
              {subjects.map((subj) => {
                const avg = classAverages[subj.subjectId];
                return (
                  <td key={subj.subjectId} className="p-3 text-center">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {avg !== null ? avg.toFixed(1) : "-"}
                    </span>
                  </td>
                );
              })}
              <td className="p-3 text-center">
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                  {(() => {
                    const validRows = matrix.filter((r) => r.average !== null);
                    return validRows.length > 0
                      ? (validRows.reduce((sum, r) => sum + r.average!, 0) / validRows.length).toFixed(1)
                      : "-";
                  })()}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
