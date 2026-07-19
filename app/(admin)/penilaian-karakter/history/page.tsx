"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { History, AlertCircle, ClipboardList } from "lucide-react";
import CharacterAssessmentService from "@/services/character-assessment.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { HistoryItem } from "@/types/character-assessment";
import { decodeJWT } from "@/lib/jwt";
import toast from "react-hot-toast";
import PageHero from "@/components/layout/PageHero";
import BackButton from "@/components/common/BackButton";
import DataField from "@/components/common/DataField";

const SCORE_COLORS: Record<string, string> = {
  high: "text-emerald-600 dark:text-emerald-400 font-semibold",
  medium: "text-blue-600 dark:text-blue-400 font-semibold",
  low: "text-amber-600 dark:text-amber-400 font-semibold",
  veryLow: "text-red-600 dark:text-red-400 font-semibold",
};

function getScoreColor(score: number): string {
  if (score >= 85) return SCORE_COLORS.high;
  if (score >= 70) return SCORE_COLORS.medium;
  if (score >= 55) return SCORE_COLORS.low;
  return SCORE_COLORS.veryLow;
}

export default function KarakterHistoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentId = searchParams.get("studentId");
  const studentName = searchParams.get("name") || "Murid";
  const studentGrade = searchParams.get("grade") || "-";

  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
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
    if (!studentId) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await CharacterAssessmentService.getHistory(studentId);
        const items = res?.result || [];
        setHistoryData(items);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Gagal memuat data riwayat";
        if (message.includes("403") || message.includes("tidak dapat mengakses")) {
          toast.error("Anda hanya dapat mengakses kelas sendiri");
          router.push("/karakter");
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [studentId, retryCount, router]);

  if (!studentId) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageHero icon={History} title="Riwayat Penilaian Karakter" />
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          Data murid tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={History}
        title="Riwayat Penilaian Karakter"
        subtitle={`${studentName} — Kelas ${studentGrade}`}
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
      ) : (
        <>
          {/* Info cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <DataField label="Nama" value={studentName} />
            <DataField label="Kelas" value={studentGrade} />
          </div>

          {/* History table */}
          {loading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              ))}
            </div>
          ) : historyData.length === 0 ? (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
              <div className="text-center py-12">
                <History size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" aria-hidden="true" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Murid belum memiliki penilaian karakter</p>
                <button
                  onClick={() => router.push("/penilaian-karakter")}
                  className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <ClipboardList size={16} className="inline mr-1" />
                  Input Penilaian Baru
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Riwayat per Bulan</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <TableHead className="w-12 text-center text-xs font-semibold text-white">No</TableHead>
                      <TableHead className="text-xs font-semibold text-white">Bulan</TableHead>
                      <TableHead className="text-center text-xs font-semibold text-white">Character Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData
                      .sort((a, b) => a.monthOrder - b.monthOrder)
                      .map((item, idx) => (
                        <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <TableCell className="text-center text-xs text-slate-500">{idx + 1}</TableCell>
                          <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-200">{item.month}</TableCell>
                          <TableCell className={`text-center text-sm ${getScoreColor(item.characterScore)}`}>
                            {item.characterScore.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Trend summary */}
          {historyData.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Rata-rata</p>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  {(historyData.reduce((sum, h) => sum + h.characterScore, 0) / historyData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Tertinggi</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.max(...historyData.map((h) => h.characterScore)).toFixed(2)}
                </p>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Terendah</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {Math.min(...historyData.map((h) => h.characterScore)).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
