"use client";

import { useAuth } from "@/hooks/useAuth";
import { useDashboardNilai } from "@/hooks/useDashboardNilai";
import { GRADES } from "@/lib/constants";
import PageHero from "@/components/layout/PageHero";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, RefreshCw, GraduationCap } from "lucide-react";
import FilterBar from "@/components/shared/FilterBar";

import { NilaiStatCards } from "./components/NilaiStatCards";
import { ComponentBreakdown } from "./components/ComponentBreakdown";
import { StudentRanking } from "./components/StudentRanking";

export default function DashboardNilaiPage() {
  const { role, grade: userGrade } = useAuth();
  const {
    grade,
    setGrade,
    semester,
    setSemester,
    academicYear,
    setAcademicYear,
    data,
    loading,
    error,
    retry,
    topRajin,
    bottomPerhatian,
    hasData
  } = useDashboardNilai(role ?? null, userGrade ?? null);

  const isAdminOrKepala = role === "admin" || role === "kepala";

  // Dummy current year data logic, can be modified as needed.
  // We use existing hooks for semester/year in the custom hook, but we need selectors here.
  const semesters = ["1", "2"];
  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear - 1}/${currentYear}`,
    `${currentYear}/${currentYear + 1}`,
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 pb-20">
      <PageHero
        icon={GraduationCap}
        title="Dashboard Akademik"
        description="Ringkasan performa akademik murid mencakup seluruh komponen penilaian (Harian, Tugas, Keaktifan, Partisipasi, Litnum)."
      />

      {/* ── Filter ─────────────────────────────────────────────────────── */}
      <FilterBar
        config={{
          showGrade: isAdminOrKepala,
          showSemester: true,
          showAcademicYear: true,
        }}
        grade={grade}
        onGradeChange={setGrade}
        gradeDisabled={!isAdminOrKepala}
        semester={semester}
        onSemesterChange={setSemester}
        academicYear={academicYear}
        onAcademicYearChange={setAcademicYear}
        gridClassName={isAdminOrKepala ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}
      >
        <div className="flex flex-col justify-end">
          <label className="block text-xs font-semibold text-transparent tracking-wider mb-2 hidden md:block">
            Aksi
          </label>
          <button
            onClick={retry}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer justify-center w-full shadow shadow-indigo-200 dark:shadow-indigo-900/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </FilterBar>

      {error ? (
        <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center gap-3 border border-rose-100 dark:border-rose-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <NilaiStatCards summary={data?.summary} loading={loading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ComponentBreakdown components={data?.summary.byComponent} loading={loading} />
            </div>
            
            <div className="lg:col-span-2">
              <StudentRanking topRajin={topRajin} bottomPerhatian={bottomPerhatian} loading={loading} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
