"use client";

import { useState, useEffect } from "react";
import { Calculator, AlertCircle, RefreshCw, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { useFinalScore } from "@/hooks/useFinalScore";
import { GRADES, ITEMS_PER_PAGE } from "@/lib/constants";
import Pagination from "@/app/components/Pagination";
import toast from "react-hot-toast";
import PageHero from "@/app/components/PageHero";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NilaiAkhirPage() {
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    userRole,
    gradeSubjects, selectedGS, setSelectedGS,
    entries, loading, initialLoading, error, retry,
    isStale, lastCalculatedAt,
    calculating, handleCalculate,
    totalStudents, completeStudents, incompleteStudents, missingByComponent,
    selectedGSData,
    SEMESTERS, ACADEMIC_YEARS,
  } = useFinalScore();

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedRow(null);
  }, [selectedGS]);

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = entries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const onCalculate = async () => {
    const ok = await handleCalculate();
    if (ok) {
      toast.success("Nilai akhir berhasil dihitung");
    } else {
      toast.error("Gagal menghitung nilai akhir");
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }) + " WIB";
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={Calculator} title="Nilai Akhir" description="Nilai akhir semester hasil kalkulasi komponen penilaian" />

      {/* Filter */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
          <div>
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
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mata Pelajaran</label>
            <Select value={selectedGS} onValueChange={(v) => v && setSelectedGS(v)} disabled={gradeSubjects.length === 0}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue placeholder={gradeSubjects.length === 0 ? "Tidak Ada Mapel" : "Pilih Mapel"}>
                {selectedGS ? gradeSubjects.find(gs => gs._id === selectedGS)?.subjectName || "-" : null}
              </SelectValue></SelectTrigger>
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
        <div className="animate-pulse space-y-3">
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-40" />
              </div>
              <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-28 shrink-0" />
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <th key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" /></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : !selectedGS || gradeSubjects.length === 0 ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <Calculator size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Mapel untuk kelas ini.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Hubungi Admin untuk menetapkan Mata Pelajaran terlebih dahulu.</p>
          </div>
        </div>
      ) : loading ? (
        <div className="animate-pulse space-y-3">
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-40" />
              </div>
              <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-28 shrink-0" />
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <th key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" /></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <Calculator size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Nilai Akhir yang dapat ditampilkan.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Pastikan Nilai Harian dan Komponen Nilai sudah lengkap, kemudian lakukan Hitung Nilai Akhir.
            </p>
            <button
              onClick={onCalculate}
              disabled={calculating}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors cursor-pointer mx-auto"
            >
              {calculating ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {calculating ? "Menghitung..." : "Hitung Sekarang"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stale banner */}
          {isStale && (
            <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle size={18} className="shrink-0" />
              <span>Bobot penilaian telah berubah. Silakan hitung ulang.</span>
            </div>
          )}

          {/* Summary card */}
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {selectedGSData?.subjectName || "-"} — {totalStudents} Siswa
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    ✅ Lengkap: {completeStudents} siswa
                  </p>
                  {Object.keys(missingByComponent).length > 0 && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      <span title={`${incompleteStudents} siswa belum lengkap`}><AlertCircle size={16} className="inline shrink-0 mr-1" /></span>
                      Belum lengkap: {incompleteStudents} siswa
                      <ul className="list-disc list-inside ml-4 text-xs text-red-400 dark:text-red-500 mt-0.5">
                        {Object.entries(missingByComponent).map(([key, count]) => (
                          <li key={key}>{key}: {count} siswa belum diisi</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {lastCalculatedAt && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Terakhir dihitung: {formatDate(lastCalculatedAt)}
                  </p>
                )}
              </div>
              <button
                onClick={onCalculate}
                disabled={calculating}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0"
              >
                {calculating ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {calculating ? "Menghitung..." : "Hitung Ulang"}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-10 whitespace-nowrap" />
                    <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-12 whitespace-nowrap">No</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Siswa</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Komponen</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-24 whitespace-nowrap">Nilai Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((entry, i) => {
                    const isExpanded = expandedRow === entry._id;
                    const compSummary = entry.componentScores
                      .filter((c) => c.rawScore > 0)
                      .map((c) => `${c.key}:${c.rawScore}`)
                      .join(", ");
                    return (
                      <>
                        <tr
                          key={entry._id}
                          className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer"
                          onClick={() => setExpandedRow(isExpanded ? null : entry._id)}
                        >
                          <td className="px-4 py-3 text-slate-400">
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">{startIndex + i + 1}</td>
                          <td className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{entry.studentName}</td>
                          <td className="px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] whitespace-nowrap">
                            {compSummary || "-"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {entry.finalScore !== null ? (
                              <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {Math.round(entry.finalScore * 100) / 100}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" title={`${entry.missingComponents.length} komponen belum diisi`}>
                                <AlertCircle size={12} />
                                {entry.missingComponents.length} komp
                              </span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${entry._id}-detail`}>
                            <td colSpan={5} className="px-4 py-3 bg-slate-50/70 dark:bg-slate-900/50">
                              <div className="pl-8 space-y-1">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Detail Komponen:</p>
                                <table className="w-full text-xs max-w-md">
                                  <thead>
                                    <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                                      <th className="text-left pb-1 pr-4 whitespace-nowrap">Komponen</th>
                                      <th className="text-right pb-1 pr-4 whitespace-nowrap">Nilai</th>
                                      <th className="text-right pb-1 pr-4 whitespace-nowrap">Bobot</th>
                                      <th className="text-right pb-1 whitespace-nowrap">Nilai × Bobot</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.componentScores.map((c) => (
                                      <tr key={c.key} className="text-slate-600 dark:text-slate-400">
                                        <td className="py-0.5 pr-4">{c.key}</td>
                                        <td className="text-right py-0.5 pr-4">{c.rawScore > 0 ? c.rawScore : "-"}</td>
                                        <td className="text-right py-0.5 pr-4">{c.weight}%</td>
                                        <td className="text-right py-0.5">
                                          {c.weightedScore > 0 ? Math.round(c.weightedScore * 100) / 100 : "-"}
                                        </td>
                                      </tr>
                                    ))}
                                    {entry.missingComponents.length > 0 && (
                                      <tr>
                                        <td colSpan={4} className="pt-1 text-red-500 dark:text-red-400">
                                          ⚠️ Komponen belum diisi: {entry.missingComponents.join(", ")}
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => { setCurrentPage(page); setExpandedRow(null); }}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={entries.length}
            />
          )}
        </>
      )}
    </div>
  );
}
