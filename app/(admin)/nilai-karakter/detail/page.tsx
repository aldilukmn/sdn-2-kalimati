"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileText, AlertCircle, History } from "lucide-react";
import CharacterAssessmentService from "@/services/character-assessment.service";
import CharacterHabitService from "@/services/character-habit.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharacterAssessment } from "@/types/character-assessment";
import type { CharacterHabit } from "@/types/character-habit";
import { decodeJWT } from "@/lib/jwt";
import toast from "react-hot-toast";
import PageHero from "@/app/components/PageHero";
import BackButton from "@/app/components/BackButton";
import DataField from "@/app/components/DataField";

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

  const [data, setData] = useState<CharacterAssessment | null>(null);
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
        const [assessmentRes, habitsRes] = await Promise.all([
          CharacterAssessmentService.getById(id),
          CharacterHabitService.getAll(),
        ]);
        const assessment = assessmentRes?.result;
        const habits: CharacterHabit[] = habitsRes?.result || [];

        if (!assessment) {
          toast.error("Data penilaian tidak ditemukan");
          router.push("/karakter");
          return;
        }

        setData(assessment);

        const map: Record<string, string> = {};
        for (const h of habits) {
          map[h._id] = h.name;
        }
        setHabitMap(map);

        const displays: HabitDisplay[] = (assessment.habits || []).map((h) => ({
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
            <AlertCircle size={40} className="mx-auto text-red-300 dark:text-red-600 mb-3" aria-hidden="true" />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button onClick={retry} className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Coba Lagi
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            ))}
          </div>
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      ) : data ? (
        <>
          {/* Info cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <DataField label="Nama" value={data.name} />
            <DataField label="Kelas" value={data.grade} />
            <DataField label="Tahun Ajaran" value={data.academicYear} />
            <DataField label="Semester" value={`Semester ${data.semester}`} />
            <DataField label="Bulan" value={data.month} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <DataField
              label="Character Score"
              value={`${data.characterScore.toFixed(2)}`}
              grade={
                data.characterScore >= 85 ? "Sangat Baik" :
                data.characterScore >= 70 ? "Baik" :
                data.characterScore >= 55 ? "Memadai" : "Kurang"
              }
            />
            <DataField label="Total Bobot" value={`${data.totalWeight} / ${data.maxWeight}`} />
            <DataField label="Dicatat oleh" value={data.recordedBy || "-"} />
          </div>

          {/* Habits table */}
          {habitDisplays.length > 0 ? (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Rincian Kebiasaan</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <TableHead className="w-12 text-center text-xs font-semibold text-white">No</TableHead>
                      <TableHead className="text-xs font-semibold text-white">Kebiasaan</TableHead>
                      <TableHead className="text-center text-xs font-semibold text-white">Nilai</TableHead>
                      <TableHead className="text-center text-xs font-semibold text-white">Bobot</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {habitDisplays.map((h, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <TableCell className="text-center text-xs text-slate-500">{idx + 1}</TableCell>
                        <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-200">{h.name}</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${VALUE_COLORS[h.value] || ""}`}>
                            {h.value}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-xs text-slate-600 dark:text-slate-300">{h.weight}</TableCell>
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
              onClick={() => router.push(`/nilai-karakter/history?studentId=${data.studentId}&name=${encodeURIComponent(data.name)}&grade=${data.grade}`)}
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
