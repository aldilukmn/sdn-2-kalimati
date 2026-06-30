"use client";

import { Loader2 } from "lucide-react";

interface StudentRow {
  _id: string;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
}

interface Props {
  data: StudentRow[];
  loading: boolean;
}

export default function StudentAttendanceTable({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
        Belum ada data kehadiran
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-blue-800 to-blue-700 text-white uppercase tracking-wider text-xs">
            <th className="px-4 py-3 text-left font-semibold">No</th>
            <th className="px-4 py-3 text-left font-semibold">Nama</th>
            <th className="px-4 py-3 text-center font-semibold">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Hadir
              </span>
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                Sakit
              </span>
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Izin
              </span>
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Alpha
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {data.map((row, i) => (
            <tr
              key={row._id}
              className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                {row.name}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {row.hadir}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {row.sakit}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {row.izin}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {row.alpha}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
