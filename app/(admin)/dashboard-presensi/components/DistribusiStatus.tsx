import { Users } from "lucide-react";

function DistBar({
  label,
  count,
  total,
  colorBar,
  colorText,
  subtitle,
}: {
  label: string;
  count: number;
  total: number;
  colorBar: string;
  colorText: string;
  subtitle?: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-14 shrink-0">
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
        {subtitle && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorBar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-8 text-right ${colorText}`}>
        {count}
      </span>
      <span className="text-[11px] text-slate-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

interface DistribusiStatusProps {
  isHarian: boolean;
  totalStudents: number;
  loading: boolean;
  summary: {
    hadir: number;
    sakit: number;
    izin: number;
    absen: number;
    total: number;
  } | null;
}

export function DistribusiStatus({
  isHarian,
  totalStudents,
  loading,
  summary,
}: DistribusiStatusProps) {
  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
      <div className="flex items-center gap-2 mb-1">
        <Users size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Distribusi Status Kehadiran
        </h3>
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">
        {isHarian
          ? `Total ${totalStudents} siswa terdaftar di kelas ini`
          : `Total entri per siswa selama bulan yang dipilih — % dihitung dari keseluruhan`}
      </p>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <DistBar
            label="Hadir"
            count={summary?.hadir ?? 0}
            total={summary?.total ?? 0}
            colorBar="bg-emerald-500"
            colorText="text-emerald-600 dark:text-emerald-400"
            subtitle={isHarian ? "siswa" : "entri"}
          />
          <DistBar
            label="Sakit"
            count={summary?.sakit ?? 0}
            total={summary?.total ?? 0}
            colorBar="bg-amber-400"
            colorText="text-amber-600 dark:text-amber-400"
            subtitle={isHarian ? "siswa" : "entri"}
          />
          <DistBar
            label="Izin"
            count={summary?.izin ?? 0}
            total={summary?.total ?? 0}
            colorBar="bg-blue-500"
            colorText="text-blue-600 dark:text-blue-400"
            subtitle={isHarian ? "siswa" : "entri"}
          />
          <DistBar
            label="Alpa"
            count={summary?.absen ?? 0}
            total={summary?.total ?? 0}
            colorBar="bg-red-500"
            colorText="text-red-600 dark:text-red-400"
            subtitle={isHarian ? "siswa" : "entri"}
          />
        </div>
      )}
    </div>
  );
}
