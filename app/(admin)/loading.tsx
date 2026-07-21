export default function AdminLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 ">
      {/* Hero Skeleton */}
      <div className="relative bg-gradient-to-br from-indigo-500/80 via-indigo-600/80 to-purple-600/70 rounded-2xl overflow-hidden shadow-xl animate-pulse h-[92px] md:h-[104px]">
        <div className="relative p-5 md:p-6 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-white/35 rounded" />
            <div className="h-4 w-64 bg-white/20 rounded" />
          </div>
        </div>
      </div>

      {/* Grid Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-5 flex items-center gap-4 animate-pulse"
          >
            <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Card Skeleton */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 animate-pulse">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-700">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-3 py-3 md:px-6 md:py-4">
                    <div className="h-4 w-20 bg-indigo-400/50 rounded mx-auto md:mx-0" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {[1, 2, 3, 4, 5].map((col) => (
                    <td key={col} className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mx-auto md:mx-0" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
