"use client";

import { useEffect } from "react";
import { ClipboardEdit, Save, ClipboardList } from "lucide-react";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { useNilaiHarian } from "@/hooks/useNilaiHarian";
import toast from "react-hot-toast";
import PageHero from "@/components/layout/PageHero";
import ScoreTable from "@/components/nilai-harian/ScoreTable";
import FilterBar from "@/components/shared/FilterBar";

export default function NilaiHarianPage() {
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    userRole,
    gradeSubjects, selectedGS, setSelectedGS,
    chapters, chapterProgress, chaptersLoading,
    selectedChapter, setSelectedChapter,
    materials, selectedMaterial, setSelectedMaterial,
    entries, paginatedEntries,
    saving, error, retry, initialLoading, scoresLoading,
    currentPage, setCurrentPage,
    totalPages, startIndex,
    handleScoreChange,
    handleMaxScoreChange,
    handleSave,
  } = useNilaiHarian();

  useEffect(() => {
    if (selectedChapter) {
      setCurrentPage(1);
    }
  }, [selectedChapter?._id, selectedMaterial]);

  const handleBulkSave = async () => {
    try {
      await handleSave();
      toast.success("Nilai berhasil disimpan");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan nilai");
    }
  };

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ClipboardEdit} title="Nilai Harian" description="Input nilai murid per bab atau per materi" />

      <FilterBar config={{ showAcademicYear: true, showSemester: true, showGrade: true, showSubject: true }} academicYear={academicYear} onAcademicYearChange={setAcademicYear} semester={semester} onSemesterChange={setSemester} grade={grade} onGradeChange={setGrade} gradeDisabled={userRole === "guru"} selectedGS={selectedGS} onSelectedGSChange={setSelectedGS} gradeSubjects={gradeSubjects} />

      {/* Chapter cards */}
      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : initialLoading ? (
        <LoadingSkeleton rows={1} />
      ) : !selectedGS || gradeSubjects.length === 0 ? (
        <EmptyState icon={ClipboardEdit} title="Belum ada Mapel untuk kelas ini." description="Hubungi Admin untuk menetapkan Mata Pelajaran terlebih dahulu." />
      ) : (
        <>
          {/* Chapter cards */}
          <div className="space-y-2">
            {chaptersLoading ? (
              <LoadingSkeleton rows={1} />
            ) : sortedChapters.length === 0 ? (
              <EmptyState icon={ClipboardList} title="Belum ada Bab untuk mapel ini." description="Buat Bab dan Materi terlebih dahulu di Struktur Akademik." action={{ label: "Atur Mapel", href: "/daftar-mapel" }} />
            ) : (
              sortedChapters.map((ch) => {
                const isActive = selectedChapter?._id === ch._id;
                const prog = chapterProgress[ch._id];
                return (
                  <button
                    key={ch._id}
                    onClick={() => {
                      setSelectedChapter(ch);
                      setSelectedMaterial("");
                    }}
                    className={`w-full text-left flex flex-row items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 shadow-sm"
                        : "bg-white/70 dark:bg-gray-800/40 border-white/20 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg shrink-0">{isActive ? "📘" : "📕"}</span>
                      <span className={`text-sm font-medium truncate ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                        {ch.name}
                      </span>
                      {ch.createdAt && (
                        <span className="hidden sm:inline text-xs font-normal opacity-70 shrink-0">
                          ({new Date(ch.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })})
                        </span>
                      )}
                      <span className={`hidden sm:inline text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        ch.inputMode === "per_material"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      }`}>
                        {ch.inputMode === "per_material" ? "Per Materi" : "Per Bab"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Desktop: progress bar */}
                      {prog && (
                        <div className="hidden sm:flex items-center gap-2 flex-1 sm:flex-none">
                          <div className="w-24 sm:w-28 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                prog.percentage === 100
                                  ? "bg-emerald-500"
                                  : prog.percentage > 0
                                  ? "bg-amber-500"
                                  : "bg-slate-300 dark:bg-slate-600"
                              }`}
                              style={{ width: `${prog.percentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {prog.gradedStudents}/{prog.totalStudents}
                          </span>
                          {prog.percentage === 100 && (
                            <span className="inline-flex items-center p-0.5 rounded-full text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300" title="Semua nilai tersimpan">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                              </svg>
                            </span>
                          )}
                        </div>
                      )}
                      {/* Mobile: icon indicator */}
                      {prog && (
                        <div className="sm:hidden flex items-center">
                          {prog.percentage === 100 ? (
                            <span 
                              title="Semua nilai tersimpan"
                              className="inline-flex items-center p-1 rounded-full text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                              </svg>
                            </span>
                          ) : (
                            <span 
                              title={`${prog.gradedStudents} dari ${prog.totalStudents} nilai tersimpan`}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {prog.gradedStudents}/{prog.totalStudents}
                            </span>
                          )}
                        </div>
                      )}
                      {isActive && (
                        <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium shrink-0">(Sedang aktif)</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {selectedChapter && !chaptersLoading && (
            <>
              {/* Material tabs */}
              {selectedChapter.inputMode === "per_material" && materials.length > 0 && (
                <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-full md:w-fit">
                  {materials.sort((a, b) => a.order - b.order).map((mat) => (
                    <button
                      key={mat._id}
                      onClick={() => setSelectedMaterial(mat._id)}
                      title={mat.createdAt ? `Dibuat: ${new Date(mat.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : undefined}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedMaterial === mat._id
                          ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {mat.name}
                      {mat.createdAt && (
                        <span className="block text-[10px] opacity-60">
                          {new Date(mat.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {selectedChapter.inputMode === "per_material" && materials.length === 0 && (
                <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Bab ini belum memiliki Materi.</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Silakan pilih bab lain atau hubungi Admin untuk menambahkan Materi.</p>
                  </div>
                </div>
              )}

              {/* Score table */}
              {(selectedChapter.inputMode === "per_chapter" || (selectedChapter.inputMode === "per_material" && selectedMaterial && materials.length > 0)) && (
                <ScoreTable
                  entries={entries}
                  paginatedEntries={paginatedEntries}
                  startIndex={startIndex}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  saving={saving}
                  loading={scoresLoading}
                  onScoreChange={handleScoreChange}
                  onMaxScoreChange={handleMaxScoreChange}
                  onPageChange={setCurrentPage}
                  saveButton={
                    <button
                      onClick={handleBulkSave}
                      disabled={saving || scoresLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                      {saving ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {saving ? "Menyimpan..." : "Simpan Semua"}
                    </button>
                  }
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
