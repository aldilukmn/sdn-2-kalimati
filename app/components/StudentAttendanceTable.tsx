"use client";

interface StudentRow {
  _id: string;
  studentIndex: number;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  absen: number;
}

interface Props {
  data: StudentRow[];
  loading: boolean;
  totalItems?: number;
}

const RATE_COLORS = [
  { min: 80, bar: "bg-emerald-500", avatar: "bg-emerald-500" },
  { min: 50, bar: "bg-orange-500", avatar: "bg-orange-500" },
  { min: 0, bar: "bg-red-500", avatar: "bg-red-500" },
];

const STATUS_COLUMNS = [
  {
    key: "hadir" as const,
    label: "Hadir",
    dot: "bg-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  {
    key: "sakit" as const,
    label: "Sakit",
    dot: "bg-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
  },
  {
    key: "izin" as const,
    label: "Izin",
    dot: "bg-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
  },
  {
    key: "absen" as const,
    label: "Absen",
    dot: "bg-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
  },
];

function getRateColor(rate: number) {
  return (
    RATE_COLORS.find((c) => rate >= c.min) ||
    RATE_COLORS[RATE_COLORS.length - 1]
  );
}

export default function StudentAttendanceTable({
  data,
  loading,
  totalItems = data.length,
}: Props) {
  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
        Belum ada data kehadiran
      </div>
    );
  }

  return (
    <div key={loading ? "skeleton" : "data"} className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/30 md:backdrop-blur-md">
      <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-700 text-indigo-50 tracking-wider text-xs">
              <th className="px-3 py-3 font-semibold w-10">No</th>
              <th className="px-3 py-3 text-left font-semibold">Nama</th>
              <th className="px-3 py-3 text-center font-semibold min-w-[120px]">
                Kehadiran (%)
              </th>
              <th className="px-3 py-3 text-center font-semibold">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Hadir
                </span>
              </th>
              <th className="px-3 py-3 text-center font-semibold">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Sakit
                </span>
              </th>
              <th className="px-3 py-3 text-center font-semibold">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Izin
                </span>
              </th>
              <th className="px-3 py-3 text-center font-semibold">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Absen
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-3">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                    </td>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((row, i) => {
                  const total = row.hadir + row.sakit + row.izin + row.absen;
                  const rate = total > 0 ? Math.round((row.hadir / total) * 100) : 0;
                  const colors = getRateColor(rate);

                  return (
                    <tr
                      key={row._id}
                      className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors animate-fadeIn">
                      <td className="px-3 py-3 text-gray-800 dark:text-gray-300 text-center">
                        <span className="text font-mono">
                          {row.studentIndex + 1}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-gray-800 dark:text-gray-200 truncate">
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-9 text-right shrink-0">
                            {rate}%
                          </span>
                        </div>
                      </td>
                      {STATUS_COLUMNS.map((s) => (
                        <td key={s.key} className="px-3 py-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
                          >
                            {row[s.key]}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
  );
}
