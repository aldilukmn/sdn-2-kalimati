"use client";

import { useEffect } from "react";
import { ClipboardEdit, Save, AlertCircle } from "lucide-react";
import { useNilaiHarian } from "@/hooks/useNilaiHarian";
import { GRADES } from "@/lib/constants";
import toast from "react-hot-toast";
import PageHero from "@/app/components/PageHero";
import ScoreTable from "@/app/components/nilai-harian/ScoreTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NilaiHarianPage() {
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
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
    SEMESTERS, ACADEMIC_YEARS,
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
      <PageHero icon={ClipboardEdit} title="Input Nilai Harian" description="Input nilai siswa per bab atau per materi" />

      {/* Filter */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
            <Select value={grade} onValueChange={(v) => v && setGrade(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mata Pelajaran</label>
            <Select value={selectedGS} onValueChange={(v) => v && setSelectedGS(v)} disabled={gradeSubjects.length === 0}>
              <SelectTrigger><SelectValue placeholder={gradeSubjects.length === 0 ? "Tidak ada mapel" : "Pilih mapel"}>
                {selectedGS ? gradeSubjects.find(gs => gs._id === selectedGS)?.subjectName || "-" : null}
              </SelectValue></SelectTrigger>
              <SelectContent>
                {gradeSubjects.map((gs) => (
                  <SelectItem key={gs._id} value={gs._id}>{gs.subjectName || "-"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chapter cards */}
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
            <ClipboardEdit size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Bab yang dapat dinilai.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Hubungi Admin untuk membuat Struktur Akademik terlebih dahulu.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Chapter cards */}
          <div className="space-y-2">
            {chaptersLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                ))}
              </div>
            ) : sortedChapters.length === 0 ? (
              <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Bab untuk mapel ini.</p>
                </div>
              </div>
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
                    className={`w-full text-left flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
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
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        ch.inputMode === "per_material"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      }`}>
                        {ch.inputMode === "per_material" ? "Per Materi" : "Per Bab"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      {prog && (
                        <div className="flex items-center gap-2 flex-1 sm:flex-none">
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedMaterial === mat._id
                          ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {mat.name}
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
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                      {saving ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {saving ? "Menyimpan..." : "💾 Simpan Semua"}
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
