"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import GuruDashboardView from "./components/GuruDashboardView";
import AdminDashboardView from "./components/AdminDashboardView";
import type { DashboardSummary, TeacherSummary } from "@/hooks/useDashboard";
import type { AttendanceRow } from "@/lib/merge-attendance";

interface Props {
  userRole: string | null;
  userName: string | null;
  userGrade: string | null;
  isSavingsHolder: boolean;
  initialMonth: number;
  initialYear: number;
  guruInitialSummary?: TeacherSummary | null;
  guruInitialChartData?: AttendanceRow[];
  guruInitialHasAttendance?: boolean;
  adminInitialSummary?: DashboardSummary | null;
}

export default function DashboardClient({
  userRole,
  userName,
  userGrade,
  isSavingsHolder,
  initialMonth,
  initialYear,
  guruInitialSummary,
  guruInitialChartData,
  guruInitialHasAttendance,
  adminInitialSummary,
}: Props) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (userRole === "guru") {
    return (
      <GuruDashboardView
        initialSummary={guruInitialSummary}
        initialChartData={guruInitialChartData}
        initialHasAttendance={guruInitialHasAttendance}
        initialMonth={initialMonth}
        initialYear={initialYear}
        userName={userName}
        userGrade={userGrade}
        userRole={userRole}
        isSavingsHolder={isSavingsHolder}
      />
    );
  }

  return (
    <AdminDashboardView
      initialSummary={adminInitialSummary}
      initialMonth={initialMonth}
      initialYear={initialYear}
      userRole={userRole}
    />
  );
}
