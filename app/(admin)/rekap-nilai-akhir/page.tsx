"use client";

import { BarChart3 } from "lucide-react";
import { useRekapNilaiAkhir } from "@/hooks/useRekapNilaiAkhir";
import { useAuth } from "@/hooks/useAuth";
import PageHero from "@/app/components/PageHero";
import ErrorState from "@/app/components/shared/ErrorState";
import EmptyState from "@/app/components/shared/EmptyState";
import LoadingSkeleton from "@/app/components/shared/LoadingSkeleton";
import RekapNilaiAkhirSheet from "@/app/components/nilai-harian/RekapNilaiAkhirSheet";
import FilterBar from "@/app/components/shared/FilterBar";

export default function RekapNilaiAkhirPage() {
  const { role: userRole, grade: userGrade } = useAuth();

  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    uniqueSubjects,
    matrix,
    classAverages,
    initialLoading, error, retry,
    hasData,
  } = useRekapNilaiAkhir(userRole, userGrade);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={BarChart3} title="Rekap Nilai Akhir" description="Rekapitulasi nilai akhir siswa per mata pelajaran" />

      <FilterBar config={{ showAcademicYear: true, showSemester: true, showGrade: true }} academicYear={academicYear} onAcademicYearChange={setAcademicYear} semester={semester} onSemesterChange={setSemester} grade={grade} onGradeChange={setGrade} gradeDisabled={userRole === "guru"} />

      {/* Content */}
      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : initialLoading ? (
        <LoadingSkeleton rows={5} />
      ) : !hasData ? (
        <EmptyState icon={BarChart3} title="Belum ada data." description="Pastikan Nilai Akhir sudah dihitung melalui menu Nilai Akhir untuk melihat nilainya." />
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
