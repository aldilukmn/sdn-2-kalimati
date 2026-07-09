"use client";

import { ScrollText, AlertCircle } from "lucide-react";
import { useRekapNilai } from "@/hooks/useRekapNilai";
import { GRADES } from "@/lib/constants";
import PageHero from "@/app/components/PageHero";
import RekapTable from "@/app/components/nilai-harian/RekapTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RekapNilaiPage() {
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    userRole,
    gradeSubjects, selectedGS, setSelectedGS,
    chapters, rekapEntries, classAverages,
    loading, error, retry, initialLoading,
    SEMESTERS, ACADEMIC_YEARS,
  } = useRekapNilai();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ScrollText} title="Rekap Nilai Harian" description="Rekapitulasi nilai siswa per bab dan per mapel" />

      {/* Filter */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tahun Ajaran</label>
            <Select value={academicYear} onValueChange={(v) => v && setAcademicYear(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACADEMIC_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Semester</label>
            <Select value={semester} onValueChange={(v) => v && setSemester(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mata Pelajaran</label>
            <Select value={selectedGS} onValueChange={(v) => v && setSelectedGS(v)} disabled={gradeSubjects.length === 0}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue placeholder={gradeSubjects.length === 0 ? "Tidak Ada Mapel" : "Pilih Mapel"}>
                {selectedGS ? gradeSubjects.find(gs => gs._id === selectedGS)?.subjectName || "-" : null}
              </SelectValue></SelectTrigger>
              <SelectContent>
                {gradeSubjects.map((gs) => (
                  <SelectItem key={gs._id} value={gs._id}>{gs.subjectName || "-"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Kelas</label>
            <Select value={grade} onValueChange={(v) => v && setGrade(v)} disabled={userRole === "guru"}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Rekap table */}
      {error ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle size={40} className="mx-auto text-red-300 dark:text-red-600 mb-3" />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button onClick={retry} className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Coba Lagi
            </button>
          </div>
        </div>
      ) : initialLoading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      ) : !selectedGS || gradeSubjects.length === 0 ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <ScrollText size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada data rekap.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Pilih filter di atas atau hubungi Admin untuk setup Mapel & Struktur Akademik.
            </p>
          </div>
        </div>
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
