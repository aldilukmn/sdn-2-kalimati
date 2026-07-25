import {
  Users,
  ClipboardList,
  CheckSquare,
  TrendingUp,
} from "lucide-react";
import StatCard from "@/components/common/StatCard";

interface NilaiStatCardsProps {
  summary: {
    totalStudents: number;
    totalAssessments: number;
    totalFilled: number;
    totalPossible: number;
    averageScore: number;
  } | undefined;
  loading: boolean;
}

export function NilaiStatCards({ summary, loading }: NilaiStatCardsProps) {
  const completionRateRaw = summary?.totalPossible 
    ? (summary.totalFilled / summary.totalPossible) * 100 
    : 0;
  const completionRate = Math.floor(completionRateRaw * 100) / 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Murid"
        value={summary?.totalStudents ?? 0}
        icon={Users}
        color="blue"
        loading={loading}
      />
      <StatCard
        label="Total Penilaian"
        value={summary?.totalAssessments ?? 0}
        icon={ClipboardList}
        color="indigo"
        loading={loading}
        subtitle="item per murid"
      />
      <StatCard
        label="Progress Input"
        value={completionRate}
        suffix="%"
        icon={CheckSquare}
        color="emerald"
        loading={loading}
        subtitle={`${summary?.totalFilled ?? 0} dari ${summary?.totalPossible ?? 0}`}
      />
      <StatCard
        label="Rata-rata Kelas"
        value={Math.round((summary?.averageScore ?? 0) * 100) / 100}
        icon={TrendingUp}
        color="amber"
        loading={loading}
      />
    </div>
  );
}
