"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Save, AlertCircle } from "lucide-react";
import { useAssessmentScore } from "@/hooks/useAssessmentScore";
import { GRADES, ITEMS_PER_PAGE } from "@/lib/constants";
import toast from "react-hot-toast";
import PageHero from "@/app/components/PageHero";
import Pagination from "@/app/components/Pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NilaiKomponenPage() {
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    userRole,
    gradeSubjects, selectedGS, setSelectedGS,
    config, configLoading, configError,
    components, nonHarianComponents,
    selectedComponentKey, setSelectedComponentKey,
    students,
    harianScores, harianLoading,
    karakterStudents, karakterLoading,
    nonHarianScores, nonHarianLoading,
    saving, error, retry, initialLoading,
    handleScoreChange, handleSave,
    SEMESTERS, ACADEMIC_YEARS,
  } = useAssessmentScore();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedComponentKey, selectedGS]);

  // Harian & non-harian pagination (uses students array)
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Karakter pagination (uses karakterStudents — from character_assessment directly)
  const karakterTotalPages = Math.ceil(karakterStudents.length / ITEMS_PER_PAGE);
  const karakterStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedKarakterStudents = karakterStudents.slice(karakterStartIndex, karakterStartIndex + ITEMS_PER_PAGE);

  const onSave = async () => {
    const ok = await handleSave();
    if (ok) {
      toast.success("Nilai berhasil disimpan");
    } else {
      toast.error("Gagal menyimpan nilai");
    }
  };

  const formulaPreview = config?.components
    ?.filter((c) => c.weight > 0)
    .map((c) => `${c.name} × ${c.weight}%`)
    .join(" + ");

  const isHarianTab = selectedComponentKey === "harian";
  const isKarakterTab = selectedComponentKey === "karakter";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ClipboardList} title="Komponen Nilai" description="Input nilai komponen penilaian (ASTS, ASAS, Proyek, dll)" />

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
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder={gradeSubjects.length === 0 ? "Tidak Ada Mapel" : "Pilih Mapel"}>
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
          <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl px-5 py-3">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28 mb-1" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-72" />
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-fit">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-24" />
            ))}
          </div>
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    {[1, 2, 3].map((j) => (
                      <th key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" /></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                      {[1, 2, 3].map((j) => (
                        <td key={j} className="px-4 py-2.5"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (!selectedGS || gradeSubjects.length === 0) && !isKarakterTab ? (
        // Tampilkan "Belum ada Mapel" HANYA jika tab yang aktif bukan karakter
        // (karakter tidak terikat mata pelajaran)
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <ClipboardList size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Mapel untuk kelas ini.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Hubungi Admin untuk menetapkan Mata Pelajaran terlebih dahulu.</p>
          </div>
        </div>
      ) : configLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl px-5 py-3">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28 mb-1" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-72" />
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-fit">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-24" />
            ))}
          </div>
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    {[1, 2, 3].map((j) => (
                      <th key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" /></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                      {[1, 2, 3].map((j) => (
                        <td key={j} className="px-4 py-2.5"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : !config ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle size={40} className="mx-auto text-amber-300 dark:text-amber-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Konfigurasi Nilai aktif.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Hubungi Admin untuk membuat Konfigurasi Nilai terlebih dahulu.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Active config info */}
          {formulaPreview && (
            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl px-5 py-3">
              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-0.5">Konfigurasi Aktif:</p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 font-semibold">
                Nilai Akhir = {formulaPreview}
              </p>
            </div>
          )}

          {/* Component tabs */}
          {components.length > 0 && (
            <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-full md:w-fit flex-wrap">
              {components.map((comp) => (
                <button
                  key={comp.key}
                  onClick={() => setSelectedComponentKey(comp.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    selectedComponentKey === comp.key
                      ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {comp.name}
                  {(comp.key === "harian" || comp.key === "karakter") && " (Readonly)"}
                </button>
              ))}
            </div>
          )}

          {/* Score table */}
          {isHarianTab ? (
            // ── TAB HARIAN: readonly, dari score per chapter ──
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
              {harianLoading ? (
                <div className="animate-pulse p-5 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">Tidak ada siswa.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-12 whitespace-nowrap">No</th>
                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Nama Siswa</th>
                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-32 whitespace-nowrap">Rata-rata Nilai Harian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((s, i) => (
                        <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50">
                          <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{startIndex + i + 1}</td>
                          <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{s.name}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {harianScores[s.studentId] !== undefined ? harianScores[s.studentId].toFixed(2) : "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {totalPages > 1 && students.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={students.length}
                />
              )}
            </div>
          ) : isKarakterTab ? (
            // ── TAB KARAKTER: readonly, dari character_assessment ──
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
              {karakterLoading ? (
                <div className="animate-pulse p-5 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  ))}
                </div>
              ) : karakterStudents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                  Belum ada data penilaian karakter untuk kelas ini.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-12 whitespace-nowrap">No</th>
                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Nama Siswa</th>
                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-40 whitespace-nowrap">Rata-rata Nilai Karakter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedKarakterStudents.map((s, i) => (
                        <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50">
                          <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{karakterStartIndex + i + 1}</td>
                          <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{s.name}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {s.avg !== null ? s.avg.toFixed(2) : "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {karakterTotalPages > 1 && karakterStudents.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={karakterTotalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={karakterStudents.length}
                />
              )}
            </div>
          ) : (
            // ── TAB NON-HARIAN: editable input (ASTS, ASAS, Proyek, dll) ──
            <>
              <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
                {nonHarianLoading ? (
                  <div className="animate-pulse p-5 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                    ))}
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">Tidak ada siswa.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                          <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-12 whitespace-nowrap">No</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Nama Siswa</th>
                          <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-40 whitespace-nowrap">
                            {components.find((c) => c.key === selectedComponentKey)?.name || selectedComponentKey}
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-28 whitespace-nowrap">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedStudents.map((s, i) => {
                          const entry = nonHarianScores[s.studentId];
                          const score = entry?.score || "";
                          const status = entry?.status || "unsaved";
                          return (
                            <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50">
                              <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{startIndex + i + 1}</td>
                              <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{s.name}</td>
                              <td className="px-4 py-2.5 text-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={score}
                                  onChange={(e) => handleScoreChange(s.studentId, e.target.value)}
                                  className="w-24 px-3 py-1.5 text-center rounded-lg border border-slate-300 bg-slate-50 dark:border-gray-700 dark:bg-gray-950 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                                />
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                  status === "saved"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                }`}>
                                  {status === "saved" ? (
                                    <span title="Tersimpan" className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                                    </span>
                                  ) : (
                                    <span title="Belum simpan" className="inline-flex items-center text-amber-600 dark:text-amber-400">
                                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    </span>
                                  )}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {totalPages > 1 && students.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={students.length}
                />
              )}

              <button
                onClick={onSave}
                disabled={saving || nonHarianLoading || students.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors cursor-pointer w-full"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Menyimpan..." : "💾 Simpan Semua"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
