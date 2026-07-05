"use client";

import {
  Users,
  CheckCircle2,
  Circle,
  GraduationCap,
  School,
  Layers,
} from "lucide-react";
import type { DashboardSummary } from "@/hooks/useDashboard";
import StatCard from "@/app/components/StatCard";

type StatCardKey =
  | "totalStudents"
  | "totalTeachers"
  | "gradeCount"
  | "totalRegistrants"
  | "validated"
  | "unvalidated";

const CARDS: { label: string; key: StatCardKey; icon: import("lucide-react").LucideIcon; fallback: number | string; color: string }[] = [
  { label: "Peserta Didik", key: "totalStudents", icon: GraduationCap, fallback: "-", color: "indigo" },
  { label: "GTK", key: "totalTeachers", icon: School, fallback: "-", color: "teal" },
  { label: "Jumlah Kelas", key: "gradeCount", icon: Layers, fallback: "-", color: "indigo" },
  { label: "Total Pendaftar", key: "totalRegistrants", icon: Users, fallback: 0, color: "blue" },
  { label: "Tervalidasi", key: "validated", icon: CheckCircle2, fallback: 0, color: "emerald" },
  { label: "Belum Tervalidasi", key: "unvalidated", icon: Circle, fallback: 0, color: "yellow" },
];

interface Props {
  summary: DashboardSummary | null;
  loading: boolean;
}

export default function DashboardStatCards({ summary, loading }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {CARDS.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={summary?.[card.key] ?? card.fallback}
          icon={card.icon}
          color={card.color}
          loading={loading}
        />
      ))}
    </div>
  );
}
