import {
  CheckCircle2,
  HeartPulse,
  FileText,
  XCircle,
  TrendingUp,
} from "lucide-react";
import StatCard from "@/components/common/StatCard";

interface PresensiStatCardsProps {
  summary: {
    hadir: number;
    sakit: number;
    izin: number;
    absen: number;
    hadirRate: number;
  } | null;
  loading: boolean;
  isHarian: boolean;
  totalStudents: number;
  avgHadirPerSiswa: number | null;
}

export function PresensiStatCards({
  summary,
  loading,
  isHarian,
  totalStudents,
  avgHadirPerSiswa,
}: PresensiStatCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Hadir"
        value={summary?.hadir ?? 0}
        icon={CheckCircle2}
        color="emerald"
        loading={loading}
        subtitle={
          isHarian
            ? `dari ${totalStudents} murid`
            : avgHadirPerSiswa !== null
            ? `rata-rata ${avgHadirPerSiswa} hari/murid`
            : undefined
        }
      />
      <StatCard
        label="Sakit"
        value={summary?.sakit ?? 0}
        icon={HeartPulse}
        color="yellow"
        loading={loading}
        subtitle={isHarian ? `murid` : undefined}
      />
      <StatCard
        label="Izin"
        value={summary?.izin ?? 0}
        icon={FileText}
        color="blue"
        loading={loading}
        subtitle={isHarian ? `murid` : undefined}
      />
      <StatCard
        label="Alpa"
        value={summary?.absen ?? 0}
        icon={XCircle}
        color="red"
        loading={loading}
        subtitle={isHarian ? `murid` : undefined}
      />
      <div className="col-span-2 lg:col-span-1">
        <StatCard
          label="Tingkat Hadir"
          value={summary?.hadirRate ?? 0}
          suffix="%"
          icon={TrendingUp}
          color="indigo"
          loading={loading}
          subtitle={isHarian ? `hari ini` : `bulan ini`}
        />
      </div>
    </div>
  );
}
