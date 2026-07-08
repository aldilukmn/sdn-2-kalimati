"use client";

import { useEffect, useState } from "react";
import { BarChart3, AlertCircle } from "lucide-react";
import { useRekapNilaiAkhir } from "@/hooks/useRekapNilaiAkhir";
import { decodeJWT } from "@/lib/jwt";
import { GRADES } from "@/lib/constants";
import PageHero from "@/app/components/PageHero";
import RekapNilaiAkhirSheet from "@/app/components/nilai-harian/RekapNilaiAkhirSheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RekapNilaiAkhirPage() {
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
    uniqueSubjects,
    matrix,
    classAverages,
    initialLoading, error, retry,
    hasData,
    SEMESTERS, ACADEMIC_YEARS,
  } = useRekapNilaiAkhir(userRole, userGrade);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={BarChart3} title="Rekap Nilai Akhir" description="Rekapitulasi nilai akhir siswa per mata pelajaran" />

      {/* Filter */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Semester</label>
            <Select value={semester} onValueChange={(v) => v && setSemester(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tahun Ajaran</label>
            <Select value={academicYear} onValueChange={(v) => v && setAcademicYear(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACADEMIC_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Kelas</label>
            <Select value={grade} onValueChange={(v) => v && setGrade(v)} disabled={userRole === "guru"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
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
          <div className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      ) : !hasData ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <BarChart3 size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada data.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Pastikan Nilai Akhir sudah dihitung melalui menu Nilai Akhir untuk melihat nilainya.
            </p>
          </div>
        </div>
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
