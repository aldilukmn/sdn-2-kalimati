import { useState } from "react";
import { TrendingUp, BarChart3, UserX, UserCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_YEARS } from "@/lib/constants";
import { MONTHS_ID } from "@/lib/format";
import dynamic from "next/dynamic";
const AttendanceTrendChart = dynamic(() => import("@/components/charts/AttendanceTrendChart"), { ssr: false });
const AttendanceBarChart = dynamic(() => import("@/components/charts/AttendanceBarChart"), { ssr: false });
import { InsightTable } from "./InsightTable";

const RATE_COLOR = (rate: number) => {
  if (rate >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 75) return "text-blue-600 dark:text-blue-400";
  if (rate >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

const ABSEN_COLOR = (n: number) => {
  if (n === 0) return "text-emerald-600 dark:text-emerald-400";
  if (n <= 2) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

interface MonthlyPresensiViewProps {
  trendYear: number;
  setTrendYear: (y: number) => void;
  grade: string;
  isAdminOrKepala: boolean;
  gradeRows: any[];
  loading: boolean;
  topAbsen: any[];
  topLowHadir: any[];
}

export function MonthlyPresensiView({
  trendYear,
  setTrendYear,
  grade,
  isAdminOrKepala,
  gradeRows,
  loading,
  topAbsen,
  topLowHadir,
}: MonthlyPresensiViewProps) {
  const [trendType, setTrendType] = useState<"bulanan" | "harian">("bulanan");
  const [trendMonth, setTrendMonth] = useState<number>(new Date().getMonth() + 1);

  return (
    <>
      {/* Tren Kehadiran Bulanan */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={16}
              className="text-indigo-500 dark:text-indigo-400 shrink-0"
            />
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Tren Kehadiran
            </h3>
          </div>
          <div className={`grid gap-2 w-full sm:w-auto ${trendType === 'harian' ? 'grid-cols-3' : 'grid-cols-2'} sm:flex sm:items-center`}>
            <Select
              value={trendType}
              onValueChange={(v) => setTrendType(v as "bulanan" | "harian")}
            >
              <SelectTrigger className="w-full sm:w-[140px] h-auto rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 capitalize">
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipe Tren</SelectLabel>
                  <SelectItem value="bulanan">Bulanan</SelectItem>
                  <SelectItem value="harian">Harian</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {trendType === "harian" && (
              <Select
                value={String(trendMonth)}
                onValueChange={(v) => v && setTrendMonth(Number(v))}
              >
                <SelectTrigger className="w-full sm:w-[130px] h-auto rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                  <SelectValue>{MONTHS_ID[trendMonth - 1]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bulan</SelectLabel>
                    {MONTHS_ID.map((m, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            <Select
              value={String(trendYear)}
              onValueChange={(v) => v && setTrendYear(Number(v))}
            >
              <SelectTrigger className="w-full sm:w-24 h-auto rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tahun</SelectLabel>
                  {AVAILABLE_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AttendanceTrendChart 
          year={trendYear} 
          grade={grade} 
          month={trendType === "harian" ? trendMonth : undefined} 
        />
      </div>

      {/* Kehadiran per Kelas (admin/kepala only) */}
      {isAdminOrKepala && gradeRows.length > 0 && (
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3
              size={16}
              className="text-indigo-500 dark:text-indigo-400 shrink-0"
            />
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Kehadiran per Kelas
            </h3>
          </div>
          <AttendanceBarChart data={gradeRows} loading={loading} />
        </div>
      )}

      {/* Dua tabel insight (bulanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tabel: Siswa Alpa Terbanyak */}
        <InsightTable
          title="Siswa Alpa Terbanyak"
          icon={<UserX size={16} className="text-red-500 dark:text-red-400 shrink-0" />}
          headerClass="from-red-600 to-rose-600"
          hoverClass="hover:bg-red-50/50 dark:hover:bg-red-900/20"
          rows={topAbsen}
          col3Label="Alpa"
          col3Value={(r) => ({
            val: r.absen,
            cls: ABSEN_COLOR(r.absen),
          })}
          col4Value={(r) => ({
            val: `${r.hadirRate}%`,
            cls: RATE_COLOR(r.hadirRate),
          })}
        />

        {/* Tabel: Siswa Kehadiran Terendah */}
        <InsightTable
          title="Siswa Kehadiran Terendah"
          icon={<UserCheck size={16} className="text-amber-500 dark:text-amber-400 shrink-0" />}
          headerClass="from-amber-500 to-orange-500"
          hoverClass="hover:bg-amber-50/50 dark:hover:bg-amber-900/20"
          rows={topLowHadir}
          col3Label="Hadir"
          col3Value={(r) => ({
            val: r.hadir,
            cls: "text-slate-700 dark:text-slate-200",
          })}
          col4Value={(r) => ({
            val: `${r.hadirRate}%`,
            cls: RATE_COLOR(r.hadirRate),
          })}
        />
      </div>
    </>
  );
}
