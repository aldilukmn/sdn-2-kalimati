"use client";

import { useEffect, useState } from "react";
import { ClipboardList, AlertCircle, Download, Users, Hash, ArrowUp, ArrowDown } from "lucide-react";
import { useRekapKarakter } from "@/hooks/useRekapKarakter";
import { useAuth } from "@/hooks/useAuth";
import { GRADES } from "@/lib/constants";
import { MONTHS_ID, formatScore } from "@/lib/format";
import { downloadCSV, wrap } from "@/lib/csv-utils";
import PageHero from "@/components/layout/PageHero";
import StatCard from "@/components/common/StatCard";
import FilterBar from "@/components/shared/FilterBar";
import RekapKarakterTable from "@/components/karakter/RekapKarakterTable";
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';

export default function RekapKarapkterPage() {
  const { payload } = useAuth();
  const userRole = payload?.role as string | undefined;

  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    month, setMonth,
    recapRows,
    monthsToShow,
    classAverages,
    totalStudents,
    avgScore,
    highestScore,
    lowestScore,
    loading, initialLoading, error, retry,
    hasData,
    SEMESTERS, ACADEMIC_YEARS,
  } = useRekapKarakter();

  const handleExportCSV = () => {
    const formattedMonths = monthsToShow.map(m => MONTHS_ID.includes(m) ? m : MONTHS_ID[parseInt(m) - 1] || m);
    const headers = ["No", "Nama", ...formattedMonths];
    if (monthsToShow.length > 1) {
      headers.push("Rerata");
    }

    const rows = recapRows.map((row, i) => {
      const cols = [String(i + 1), wrap(row.name)];
      for (const m of monthsToShow) {
        cols.push(row.monthlyScores[m] !== null ? String(row.monthlyScores[m]) : "-");
      }
      if (monthsToShow.length > 1) {
        cols.push(row.studentAverage !== null ? String(row.studentAverage) : "-");
      }
      return cols.join(",");
    });

    const filename = `rekap_karakter_kelas_${grade}_${academicYear.replace("/", "_")}_semester_${semester}${month ? `_${month}` : ""}.csv`;
    downloadCSV(headers, rows, filename);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ClipboardList} title="Rekap Karakter" description="Rekapitulasi penilaian karakter murid per bulan" />

      {/* Filters */}
      <FilterBar
        config={{ showAcademicYear: true, showSemester: true, showGrade: true }}
        academicYear={academicYear}
        onAcademicYearChange={(v) => v && setAcademicYear(v)}
        semester={semester}
        onSemesterChange={(v) => v && setSemester(v)}
        grade={grade}
        onGradeChange={(v) => v && setGrade(v)}
        gradeDisabled={userRole?.toLowerCase() !== "admin"}
        gridClassName="grid-cols-2 md:grid-cols-3"
        gradeClassName="col-span-2 md:col-span-1"
      />

      {/* Content */}
      {error ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle size={40} className="mx-auto text-red-300 dark:text-red-600 mb-3" aria-hidden="true" />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button onClick={retry} className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Coba Lagi
            </button>
          </div>
        </div>
      ) : initialLoading ? (
        <LoadingSkeleton rows={1} />
      ) : !hasData ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <ClipboardList size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" aria-hidden="true" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada data.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Belum ada penilaian karakter untuk filter yang dipilih.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Murid"
              value={totalStudents}
              icon={Users}
              color="indigo"
              loading={loading}
            />
            <StatCard
              label="Rerata Skor"
              value={formatScore(avgScore)}
              icon={Hash}
              color="teal"
              loading={loading}
            />
            <StatCard
              label="Skor Tertinggi"
              value={formatScore(highestScore)}
              icon={ArrowUp}
              color="emerald"
              loading={loading}
            />
            <StatCard
              label="Skor Terendah"
              value={formatScore(lowestScore)}
              icon={ArrowDown}
              color="yellow"
              loading={loading}
            />
          </div>

          {/* Table with Export */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-end">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
            <RekapKarakterTable
              recapRows={recapRows}
              monthsToShow={monthsToShow}
              classAverages={classAverages}
              grade={grade}
            />
          </div>
        </>
      )}
    </div>
  );
}
