"use client";

import { BarChart3 } from "lucide-react";
import { useRekapNilaiAkhir } from "@/hooks/useRekapNilaiAkhir";
import { useAuth } from "@/hooks/useAuth";
import PageHero from "@/components/layout/PageHero";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import RekapNilaiAkhirSheet from "@/components/nilai-harian/RekapNilaiAkhirSheet";
import FilterBar from "@/components/shared/FilterBar";
import TableSkeleton from "@/components/tables/TableSkeleton";

export default function RekapNilaiAkhirPage() {
  const { role: userRole, grade: userGrade } = useAuth();

  const {
    semester,
    setSemester,
    academicYear,
    setAcademicYear,
    grade,
    setGrade,
    uniqueSubjects,
    matrix,
    classAverages,
    initialLoading,
    error,
    retry,
    hasData,
  } = useRekapNilaiAkhir(userRole, userGrade);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={BarChart3}
        title="Rekap Nilai Akhir"
        description="Rekapitulasi nilai akhir siswa per mata pelajaran"
      />

      <FilterBar
        config={{ showAcademicYear: true, showSemester: true, showGrade: true }}
        academicYear={academicYear}
        onAcademicYearChange={setAcademicYear}
        semester={semester}
        onSemesterChange={setSemester}
        grade={grade}
        onGradeChange={setGrade}
        gradeDisabled={userRole === "guru"}
        gridClassName="grid-cols-2 md:grid-cols-3"
        gradeClassName="col-span-2 md:col-span-1"
      />

      {/* Content */}
      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : initialLoading ? (
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
          <TableSkeleton
            headers={["No", "Nama", "Mata Pelajaran", "Rerata"]}
            rows={5}
          />
        </div>
      ) : !hasData ? (
        <EmptyState
          icon={BarChart3}
          title="Belum ada data."
          description="Pastikan Nilai Akhir sudah dihitung melalui menu Nilai Akhir untuk melihat nilainya."
        />
      ) : (
        <RekapNilaiAkhirSheet
          matrix={matrix}
          subjects={uniqueSubjects}
          classAverages={classAverages}
        />
      )}
    </div>
  );
}
