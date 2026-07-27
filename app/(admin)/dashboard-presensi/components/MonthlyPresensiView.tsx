import { BarChart3, UserX, UserCheck } from "lucide-react";
import dynamic from "next/dynamic";
const AttendanceBarChart = dynamic(() => import("@/components/charts/AttendanceBarChart"), { ssr: false });
import { InsightTable } from "./InsightTable";
import MobileWidgetWrapper from "@/components/common/MobileWidgetWrapper";

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
  grade: string;
  isAdminOrKepala: boolean;
  gradeRows: any[];
  loading: boolean;
  topAbsen: any[];
  topLowHadir: any[];
}

export function MonthlyPresensiView({
  grade,
  isAdminOrKepala,
  gradeRows,
  loading,
  topAbsen,
  topLowHadir,
}: MonthlyPresensiViewProps) {
  return (
    <>
      {/* Kehadiran per Kelas (admin/kepala only) */}
      {isAdminOrKepala && gradeRows.length > 0 && (
        <MobileWidgetWrapper
          title="Kehadiran per Kelas"
          icon={<BarChart3 size={16} className="text-indigo-500 dark:text-indigo-400" />}
        >
          <div className="mt-2 flex-1">
            <AttendanceBarChart data={gradeRows} loading={loading} />
          </div>
        </MobileWidgetWrapper>
      )}

      {/* Dua tabel insight (bulanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tabel: Murid Absen Terbanyak */}
        <InsightTable
          title="Murid Absen Terbanyak"
          icon={<UserX size={16} className="text-red-500 dark:text-red-400 shrink-0" />}
          headerClass="from-red-600 to-rose-600"
          hoverClass="hover:bg-red-50/50 dark:hover:bg-red-900/20"
          rows={topAbsen}
          col3Label="Absen"
          col3Value={(r) => ({
            val: r.absen,
            cls: ABSEN_COLOR(r.absen),
          })}
          col4Value={(r) => ({
            val: `${r.hadirRate}%`,
            cls: RATE_COLOR(r.hadirRate),
          })}
        />

        {/* Tabel: Murid Kehadiran Terendah */}
        <InsightTable
          title="Murid Kehadiran Terendah"
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
