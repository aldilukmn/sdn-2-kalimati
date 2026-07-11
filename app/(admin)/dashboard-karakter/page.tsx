"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, AlertCircle, Users, FileText, Hash, ArrowUp, ArrowDown, Star, ThumbsUp, Minus, XCircle, ListChecks, ScrollText, History, Eye, ArrowRight } from "lucide-react";
import { useDashboardKarakter } from "@/hooks/useDashboardKarakter";
import { decodeJWT } from "@/lib/jwt";
import { GRADES } from "@/lib/constants";
import PageHero from "@/app/components/PageHero";
import StatCard from "@/app/components/StatCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardKarakterPage() {
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
    totalStudents,
    totalAssessments,
    avgScore,
    highestScore,
    lowestScore,
    distribution,
    recentAssessments,
    loading, initialLoading, error, retry,
    hasData,
    SEMESTERS, ACADEMIC_YEARS,
  } = useDashboardKarakter(userRole, userGrade);

  const DistribusiIcon = (label: string) => {
    switch (label) {
      case "Istimewa": return Star;
      case "Baik": return ThumbsUp;
      case "Cukup": return Minus;
      default: return XCircle;
    }
  };

  const distribusiItems = [
    { label: "Istimewa", key: "excellent" as const, color: "emerald" as const, desc: "≥ 85" },
    { label: "Baik", key: "good" as const, color: "sky" as const, desc: "70 – 84" },
    { label: "Cukup", key: "fair" as const, color: "amber" as const, desc: "55 – 69" },
    { label: "Kurang", key: "poor" as const, color: "rose" as const, desc: "< 55" },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={BarChart3} title="Dashboard Karakter" description="Ringkasan penilaian karakter siswa" />

      {/* Filter */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tahun Ajaran</label>
            <Select value={academicYear} onValueChange={(v) => v && setAcademicYear(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
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
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Semester</label>
            <Select value={semester} onValueChange={(v) => v && setSemester(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
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
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Kelas</label>
            <Select value={grade} onValueChange={(v) => v && setGrade(v)} disabled={userRole === "guru"}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
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
        <div className="animate-pulse space-y-6">
          {/* Skeleton summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            ))}
          </div>
          {/* Skeleton distribution */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
          {/* Skeleton table */}
          <div className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      ) : !hasData ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <BarChart3 size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada data penilaian.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Belum ada penilaian karakter untuk kelas ini.
            </p>
            <Link
              href={`/karakter?grade=${grade}`}
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Input Penilaian Baru
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Total Siswa" value={totalStudents} icon={Users} color="indigo" loading={loading} />
            <StatCard label="Total Penilaian" value={totalAssessments} icon={FileText} color="teal" loading={loading} />
            <StatCard label="Rata-rata Skor" value={avgScore !== null ? avgScore.toFixed(2) : "-"} icon={Hash} color="teal" loading={loading} />
            <StatCard label="Skor Tertinggi" value={highestScore !== null ? highestScore.toFixed(2) : "-"} icon={ArrowUp} color="emerald" loading={loading} />
            <StatCard label="Skor Terendah" value={lowestScore !== null ? lowestScore.toFixed(2) : "-"} icon={ArrowDown} color="yellow" loading={loading} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Akses Cepat</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href={`/karakter?grade=${grade}`}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium transition-all"
              >
                <FileText size={16} />
                Input Penilaian
              </Link>
              <Link
                href="/karakter-habits"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-medium transition-all"
              >
                <ListChecks size={16} />
                Kebiasaan
              </Link>
              <Link
                href={`/rekap-karakter?grade=${grade}`}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium transition-all"
              >
                <ScrollText size={16} />
                Rekap
              </Link>
              <Link
                href={`/karakter?grade=${grade}`}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium transition-all"
              >
                <History size={16} />
                Riwayat
              </Link>
            </div>
          </div>

          {/* Distribusi Nilai */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Distribusi Nilai</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {distribusiItems.map((item) => {
                const count = distribution[item.key];
                const Icon = DistribusiIcon(item.label);
                return (
                  <StatCard
                    key={item.key}
                    label={item.label}
                    value={count}
                    icon={Icon}
                    variant="simple"
                    color={item.color}
                    loading={loading}
                    subtitle={item.desc}
                    valueClassName={count > 0 ? "" : "text-slate-400 dark:text-slate-500"}
                  />
                );
              })}
            </div>
          </div>

          {/* Penilaian Terbaru */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Penilaian Terbaru</h3>
            <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
              <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 backdrop-blur-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                      <th className="px-3 py-3 text-center w-10">No</th>
                      <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Nama</th>
                      <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Bulan</th>
                      <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Skor</th>
                      <th className="px-3 py-3 text-center font-semibold whitespace-nowrap w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                    {recentAssessments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-sm text-slate-400 dark:text-slate-500">
                          Belum ada penilaian.
                        </td>
                      </tr>
                    ) : (
                      recentAssessments.map((item, i) => (
                        <tr key={item._id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                          <td className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">{i + 1}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{item.name}</span>
                          </td>
                          <td className="p-3 text-center text-sm text-slate-600 dark:text-slate-400">{item.month}</td>
                          <td className="p-3 text-center">
                            <span className={`text-sm font-bold ${item.characterScore >= 85 ? "text-emerald-600 dark:text-emerald-400" : item.characterScore >= 70 ? "text-blue-600 dark:text-blue-400" : item.characterScore >= 55 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400"}`}>
                              {item.characterScore.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <Link
                              href={`/karakter/detail?id=${item._id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                            >
                              <Eye size={14} />
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer link */}
          <div className="text-center">
            <Link
              href={`/rekap-karakter?grade=${grade}&semester=${semester}&academicYear=${academicYear}`}
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              Lihat Rekap Lengkap
              <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
