"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADES, SEMESTERS, ACADEMIC_YEARS, AVAILABLE_YEARS } from "@/lib/constants";
import { ReactNode } from "react";

interface FilterConfig {
  showAcademicYear?: boolean;
  showSemester?: boolean;
  showGrade?: boolean;
  showSubject?: boolean;
  showMonth?: boolean;
  showYear?: boolean;
}

interface FilterBarProps {
  config: FilterConfig;
  academicYear?: string;
  onAcademicYearChange?: (v: string) => void;
  semester?: string;
  onSemesterChange?: (v: string) => void;
  grade?: string;
  onGradeChange?: (v: string) => void;
  gradeDisabled?: boolean;
  selectedGS?: string;
  onSelectedGSChange?: (v: string) => void;
  gradeSubjects?: { _id: string; subjectName?: string }[];
  subjectPlaceholder?: string;
  month?: string;
  onMonthChange?: (v: string) => void;
  months?: string[];
  year?: string;
  onYearChange?: (v: string) => void;
  className?: string;
  gridClassName?: string;
  children?: ReactNode;
}

export default function FilterBar({
  config = { showAcademicYear: true, showSemester: true, showGrade: true, showSubject: false, showMonth: false, showYear: false },
  academicYear = "",
  onAcademicYearChange,
  semester = "",
  onSemesterChange,
  grade = "",
  onGradeChange,
  gradeDisabled = false,
  selectedGS = "",
  onSelectedGSChange,
  gradeSubjects = [],
  subjectPlaceholder,
  month = "",
  onMonthChange,
  months = [],
  year = "",
  onYearChange,
  className = "",
  gridClassName = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  children,
}: FilterBarProps) {
  // Use a generic grid that wraps nicely
  return (
    <div className={`bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-10 ${className}`}>
      <div className={`grid gap-4 ${gridClassName}`}>
        {config.showAcademicYear && onAcademicYearChange && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Tahun Ajaran</label>
            <Select value={academicYear} onValueChange={(v) => v && onAcademicYearChange(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tahun Ajaran</SelectLabel>
                  {ACADEMIC_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {config.showSemester && onSemesterChange && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Semester</label>
            <Select value={semester} onValueChange={(v) => v && onSemesterChange(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Semester</SelectLabel>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {config.showGrade && onGradeChange && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Kelas</label>
            <Select value={grade} onValueChange={(v) => v && onGradeChange(v)} disabled={gradeDisabled}>
              <SelectTrigger className={`w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 ${!grade ? "opacity-60" : ""}`}>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kelas</SelectLabel>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {config.showSubject && onSelectedGSChange && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Mata Pelajaran</label>
            <Select value={selectedGS} onValueChange={(v) => v && onSelectedGSChange(v)} disabled={gradeSubjects.length === 0}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder={subjectPlaceholder || (gradeSubjects.length === 0 ? "Tidak Ada Mapel" : "Pilih Mapel")}>
                  {selectedGS ? gradeSubjects.find(gs => gs._id === selectedGS)?.subjectName || "-" : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mata Pelajaran</SelectLabel>
                  {gradeSubjects.map((gs) => (
                    <SelectItem key={gs._id} value={gs._id}>{gs.subjectName || "-"}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {config.showMonth && onMonthChange && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Bulan</label>
            <Select value={month} onValueChange={(v) => v && onMonthChange(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Pilih Bulan">
                  {month && months.length > 0 ? months[Number(month) - 1] : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bulan</SelectLabel>
                  {months.map((m, i) => (
                    <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {config.showYear && onYearChange && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Tahun</label>
            <Select value={year} onValueChange={(v) => v && onYearChange(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tahun</SelectLabel>
                  {AVAILABLE_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
