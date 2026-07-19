"use client";

import { ScrollText } from "lucide-react";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { useRekapNilai } from "@/hooks/useRekapNilai";
import PageHero from "@/components/layout/PageHero";
import RekapTable from "@/components/nilai-harian/RekapTable";
import FilterBar from "@/components/shared/FilterBar";

export default function RekapNilaiPage() {
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    userRole,
    gradeSubjects, selectedGS, setSelectedGS,
    chapters, rekapEntries, classAverages,
    loading, error, retry, initialLoading,
  } = useRekapNilai();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ScrollText} title="Rekap Nilai Harian" description="Rekapitulasi nilai siswa per bab dan per mapel" />

      <FilterBar config={{ showAcademicYear: true, showSemester: true, showGrade: true, showSubject: true }} academicYear={academicYear} onAcademicYearChange={setAcademicYear} semester={semester} onSemesterChange={setSemester} grade={grade} onGradeChange={setGrade} gradeDisabled={userRole === "guru"} selectedGS={selectedGS} onSelectedGSChange={setSelectedGS} gradeSubjects={gradeSubjects} />

      {/* Rekap table */}
      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : initialLoading ? (
        <LoadingSkeleton rows={1} />
      ) : !selectedGS || gradeSubjects.length === 0 ? (
        <EmptyState icon={ScrollText} title="Belum ada data rekap." description="Pilih filter di atas atau hubungi Admin untuk setup Mapel & Struktur Akademik." />
      ) : (
        <RekapTable
          chapters={chapters}
          entries={rekapEntries}
          classAverages={classAverages}
          loading={loading}
        />
      )}
    </div>
  );
}
