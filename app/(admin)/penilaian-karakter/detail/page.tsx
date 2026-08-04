"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileText, AlertCircle, History, User, Calendar, Award, Star, CheckCircle } from "lucide-react";
import CharacterAssessmentService from "@/services/character-assessment.service";
import CharacterHabitService from "@/services/character-habit.service";
import UserService from "@/services/user.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharacterAssessment } from "@/types/character-assessment";
import type { CharacterHabit } from "@/types/character-habit";
import { decodeJWT } from "@/lib/jwt";
import { formatScore } from "@/lib/format";
import toast from "react-hot-toast";
import PageHero from "@/components/layout/PageHero";
import BackButton from "@/components/common/BackButton";
// Removed DataField import

interface HabitDisplay {
  name: string;
  value: string;
  weight: number;
}

const SCORE_COLORS: Record<string, string> = {
  high: "text-emerald-600 dark:text-emerald-400",
  medium: "text-blue-600 dark:text-blue-400",
  low: "text-amber-600 dark:text-amber-400",
  veryLow: "text-red-600 dark:text-red-400",
};

function getScoreColor(score: number): string {
  if (score >= 85) return SCORE_COLORS.high;
  if (score >= 70) return SCORE_COLORS.medium;
  if (score >= 55) return SCORE_COLORS.low;
  return SCORE_COLORS.veryLow;
}

import { useAuth } from "@/hooks/useAuth";

const VALUE_COLORS: Record<string, string> = {
  A: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  B: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  C: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  D: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
};

export default function KarakterDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const { payload } = useAuth();

  const [data, setData] = useState<CharacterAssessment | null>(null);
  const [recorderName, setRecorderName] = useState<string>("");
  const [habitMap, setHabitMap] = useState<Record<string, string>>({});
  const [habitDisplays, setHabitDisplays] = useState<HabitDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      const payload = decodeJWT(token);
      setUserRole(payload?.role || null);
    }
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (!id) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [assessmentRes, habitsRes, usersRes, meRes] = await Promise.all([
          CharacterAssessmentService.getById(id),
          CharacterHabitService.getAll(true).catch(() => null),
          UserService.getAll(true).catch(() => UserService.getTeachers(true).catch(() => null)),
          UserService.getMe(true).catch(() => null),
        ]);
        const assessment = assessmentRes?.result || (assessmentRes as any)?.data || (assessmentRes as any);
        const habits = Array.isArray(habitsRes) ? habitsRes : (habitsRes?.result || (habitsRes as any)?.data || []);
        // @ts-ignore
        const users = Array.isArray(usersRes) ? usersRes : (usersRes?.result || usersRes?.data || []);
        const me = meRes?.result || (meRes as any)?.data || (meRes as any);

        if (!assessment) {
          toast.error("Data penilaian tidak ditemukan");
          router.push("/karakter");
          return;
        }

        setData(assessment);
        
        const recorder = users.find(u => 
          u.username === assessment.recordedBy || 
          u._id === assessment.recordedBy || 
          (u.username && assessment.recordedBy && u.username.toLowerCase() === assessment.recordedBy.toLowerCase())
        );
        
        let foundName = "";
        if (recorder) {
          // @ts-ignore
          foundName = recorder.fullName || recorder.name;
        }
        
        if (!foundName && payload && (payload.username === assessment.recordedBy || payload.id === assessment.recordedBy || payload._id === assessment.recordedBy)) {
          // @ts-ignore
          foundName = payload.fullName || payload.name;
        }
        
        if (!foundName && me && (me.username === assessment.recordedBy || me._id === assessment.recordedBy)) {
          foundName = me.fullName || me.name;
        }

        if (foundName) {
          setRecorderName(foundName);
        }

        const map: Record<string, string> = {};
        for (const h of habits) {
          map[h._id] = h.name;
        }
        setHabitMap(map);

        const displays: HabitDisplay[] = (assessment.habits || []).map((h: any) => ({
          name: map[h.habitId] || h.habitId,
          value: h.value,
          weight: h.weight,
        }));
        setHabitDisplays(displays);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Gagal memuat data penilaian";
        if (message.includes("403") || message.includes("tidak dapat mengakses")) {
          toast.error("Anda hanya dapat mengakses kelas sendiri");
          router.push("/karakter");
        } else if (message.includes("404") || message.includes("tidak ditemukan")) {
          toast.error("Data penilaian tidak ditemukan");
          router.push("/karakter");
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [id, retryCount, router]);

  if (!id) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageHero icon={FileText} title="Detail Penilaian Karakter" />
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          ID penilaian tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={FileText}
        title="Detail Penilaian Karakter"
        subtitle={data ? data.name : "Memuat..."}
      />

      <BackButton />

      {error ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle
              size={40}
              className="mx-auto text-red-300 dark:text-red-600 mb-3"
              aria-hidden="true"
            />
            <p className="text-red-500 dark:text-red-400 font-medium">
              {error}
            </p>
            <button
              onClick={retry}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl"
              />
            ))}
          </div>
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      ) : data ? (
        <>
          {/* Version 4: Modern Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            
            {/* Bento Item 1: Main Profile (Spans 2 columns, 2 rows) */}
            <div className="md:col-span-2 md:row-span-2 flex flex-col justify-between bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 dark:from-indigo-900 dark:via-indigo-800 dark:to-purple-900 rounded-[2rem] p-8 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 flex items-start gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-indigo-100 font-semibold tracking-wider uppercase text-xs mb-1">
                    Data Siswa
                  </p>
                  <h2 className="text-3xl font-bold leading-tight">
                    {data.name}
                  </h2>
                </div>
              </div>
              
              <div className="relative z-10 flex flex-wrap gap-2">
                <span className="bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1.5">
                  <FileText size={14} /> Semester {data.semester}
                </span>
                <span className="bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1.5">
                  <Calendar size={14} /> {(() => {
                    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                    const m = parseInt(data.month);
                    return !isNaN(m) && m >= 1 && m <= 12 ? months[m - 1] : data.month;
                  })()}
                </span>
                <span className="bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1.5">
                  <User size={14} /> Kelas {data.grade}
                </span>
              </div>
            </div>

            {/* Bento Item 2: Main Score (Spans 1 column, 2 rows) */}
            <div className="md:col-span-1 md:row-span-2 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50/50 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-500">
                <Award size={32} />
              </div>
              <p className="relative z-10 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                Nilai Karakter
              </p>
              <h3 className="relative z-10 text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {formatScore(data.characterScore)}
              </h3>
            </div>

            {/* Bento Item 3: Predicate (Spans 1 column, 1 row) */}
            <div className={`md:col-span-1 md:row-span-1 flex flex-col justify-center rounded-[2rem] p-6 text-white shadow-sm relative overflow-hidden ${
              data.characterScore >= 85 ? 'bg-emerald-500 shadow-emerald-500/20' : data.characterScore >= 70 ? 'bg-blue-500 shadow-blue-500/20' : data.characterScore >= 55 ? 'bg-yellow-500 shadow-yellow-500/20' : 'bg-red-500 shadow-red-500/20'
            }`}>
              <p className="text-white/70 font-semibold uppercase tracking-wider text-xs mb-1">
                Predikat
              </p>
              <h3 className="text-2xl font-bold">
                {data.characterScore >= 85 ? "Sangat Baik" : data.characterScore >= 70 ? "Baik" : data.characterScore >= 55 ? "Memadai" : "Kurang"}
              </h3>
            </div>

            {/* Bento Item 4: Total Bobot (Spans 1 column, 1 row) */}
            <div className="md:col-span-1 md:row-span-1 flex flex-col justify-center bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <p className="relative z-10 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Total Bobot
              </p>
              <div className="relative z-10 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800 dark:text-white">
                  {data.totalWeight}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  / {data.maxWeight}
                </span>
              </div>
            </div>
            
            {/* Bento Item 5: Metadata Footer (Spans full width or remaining space) */}
            <div className="md:col-span-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-[1.5rem] p-4 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>Tervalidasi & Dicatat oleh <strong className="text-indigo-600 dark:text-indigo-400">{recorderName || data.recordedBy || "-"}</strong></span>
              </div>
              <div className="text-xs font-medium text-slate-400">
                Tahun Ajaran {data.academicYear}
              </div>
            </div>

          </div>

          {/* Habits table */}
          {habitDisplays.length > 0 ? (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Rincian Kebiasaan
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <TableHead className="w-12 text-center text-xs font-semibold text-white">
                        No
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-white">
                        Kebiasaan
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold text-white">
                        Nilai
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold text-white">
                        Bobot
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {habitDisplays.map((h, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <TableCell className="text-center text-xs text-slate-500">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {h.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${VALUE_COLORS[h.value] || ""}`}
                          >
                            {h.value}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-xs text-slate-600 dark:text-slate-300">
                          {h.weight}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              Tidak ada data kebiasaan
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                router.push(
                  `/penilaian-karakter/history?studentId=${data.studentId}&name=${encodeURIComponent(data.name)}&grade=${data.grade}`,
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <History size={16} />
              Lihat Riwayat
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
