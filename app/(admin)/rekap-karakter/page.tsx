"use client";

import { useEffect, useState } from "react";
import { ClipboardList, AlertCircle, Download, Users, Hash, ArrowUp, ArrowDown } from "lucide-react";
import { useRekapKarakter } from "@/hooks/useRekapKarakter";
import { decodeJWT } from "@/lib/jwt";
import { GRADES } from "@/lib/constants";
import { MONTHS_ID } from "@/lib/format";
import { downloadCSV, wrap } from "@/lib/csv-utils";
import PageHero from "@/app/components/PageHero";
import StatCard from "@/app/components/StatCard";
import FilterBar from "@/app/components/shared/FilterBar";
import RekapKarakterTable from "@/app/components/karakter/RekapKarakterTable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSkeleton from '@/app/components/shared/LoadingSkeleton';

export default function RekapKarapkterPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      const payload = decodeJWT(token);
      setUserRole(payload?.role || null);
      setUserGrade(payload?.grade || null);
    }
  }, []);

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
  } = useRekapKarakter(userRole, userGrade);

  const handleExportCSV = () => {
    const showMonthColumns = monthsToShow.length > 1;
    const headers = ["No", "Nama"];
    if (showMonthColumns) {
      headers.push(...monthsToShow, "Rata-rata");
    } else {
      headers.push("Skor Karakter");
    }

    const rows = recapRows.map((row, i) => {
      const cols = [String(i + 1), wrap(row.name)];
      if (showMonthColumns) {
        for (const m of monthsToShow) {
          cols.push(row.monthlyScores[m] !== null ? String(row.monthlyScores[m]) : "-");
        }
        cols.push(row.studentAverage !== null ? String(row.studentAverage) : "-");
      } else {
        cols.push(row.studentAverage !== null ? String(row.studentAverage) : "-");
      }
      return cols.join(",");
    });

    const filename = `rekap_karakter_kelas_${grade}_${academicYear.replace("/", "_")}_semester_${semester}${month ? `_${month}` : ""}.csv`;
    downloadCSV(headers, rows, filename);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ClipboardList} title="Rekap Karakter" description="Rekapitulasi penilaian karakter siswa per bulan" />

      {/* Filters */}
      <FilterBar
        config={{ showAcademicYear: true, showSemester: true, showGrade: true }}
        academicYear={academicYear}
        onAcademicYearChange={(v) => v && setAcademicYear(v)}
        semester={semester}
        onSemesterChange={(v) => v && setSemester(v)}
        grade={grade}
        onGradeChange={(v) => v && setGrade(v)}
        gradeDisabled={userRole === "guru"}
      >
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Bulan</label>
          <Select value={month || ""} onValueChange={(v) => setMonth(v != null ? (v === "__all__" ? "" : v) : "")}>
            <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue placeholder="Semua Bulan" /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bulan</SelectLabel>
                <SelectItem value="__all__">Semua Bulan</SelectItem>
                {MONTHS_ID.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

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
              label="Total Siswa"
              value={totalStudents}
              icon={Users}
              color="indigo"
              loading={loading}
            />
            <StatCard
              label="Rata-rata Skor"
              value={avgScore !== null ? avgScore.toFixed(2) : "-"}
              icon={Hash}
              color="teal"
              loading={loading}
            />
            <StatCard
              label="Skor Tertinggi"
              value={highestScore !== null ? highestScore.toFixed(2) : "-"}
              icon={ArrowUp}
              color="emerald"
              loading={loading}
            />
            <StatCard
              label="Skor Terendah"
              value={lowestScore !== null ? lowestScore.toFixed(2) : "-"}
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
