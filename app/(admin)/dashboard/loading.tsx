export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fadeIn">
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

      {/* Grid 4 Stat Cards Skeleton (Admin / Kepala View) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
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

      {/* Filter Period Card Skeleton */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 animate-pulse">
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 animate-pulse min-h-[300px]"
          >
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
            <div className="flex items-center justify-center h-48">
              <div className="w-32 h-32 rounded-full border-[12px] border-slate-200 dark:border-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
