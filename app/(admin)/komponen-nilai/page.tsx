"use client";

import { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import { useAssessmentScore } from "@/hooks/useAssessmentScore";
import ErrorState from "@/app/components/shared/ErrorState";
import EmptyState from "@/app/components/shared/EmptyState";
import LoadingSkeleton from "@/app/components/shared/LoadingSkeleton";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { AssessmentComponent } from "@/types/nilai-harian";
import toast from "react-hot-toast";
import PageHero from "@/app/components/PageHero";
import TabNilaiHarian from "./components/TabNilaiHarian";
import TabKarakter from "./components/TabKarakter";
import TabPresensi from "./components/TabPresensi";
import TabTugas from "./components/TabTugas";
import TabLitnum from "./components/TabLitnum";
import TabNonHarian from "./components/TabNonHarian";
import FilterBar from "@/app/components/shared/FilterBar";

export default function NilaiKomponenPage() {
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    role: userRole,
    gradeSubjects, selectedGS, setSelectedGS,
    config, configLoading, configError,
    components, nonHarianComponents,
    selectedComponentKey, setSelectedComponentKey,
    students,
    harianScores, harianLoading,
    tugasScores, tugasLoading,
    karakterStudents, karakterLoading,
    presensiStudents, presensiLoading,
    litnumStudents, litnumLoading,
    nonHarianScores, nonHarianLoading,
    saving, error, retry, initialLoading,
    handleScoreChange, handleSave,
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

  const colorPalette = [
    "text-indigo-600 dark:text-indigo-300",
    "text-emerald-600 dark:text-emerald-300",
    "text-amber-600 dark:text-amber-300",
    "text-rose-600 dark:text-rose-300",
    "text-cyan-600 dark:text-cyan-300",
    "text-purple-600 dark:text-purple-300",
    "text-orange-600 dark:text-orange-300",
    "text-teal-600 dark:text-teal-300",
  ];
  const formulaComponents = (config?.components
    ?.reduce((acc, c, i) => {
      if (c.weight > 0) acc.push({ ...c, color: colorPalette[i % colorPalette.length] });
      return acc;
    }, [] as (AssessmentComponent & { color: string })[]) || []);

  const getTabColor = (index: number) => colorPalette[index % colorPalette.length];

  const safeKey = (key: string) => key?.trim().toLowerCase() || "";
  
  const isHarianTab = safeKey(selectedComponentKey) === "harian";
  const isKarakterTab = safeKey(selectedComponentKey) === "karakter";
  const isPresensiTab = safeKey(selectedComponentKey) === "presensi";
  const isTugasTab = safeKey(selectedComponentKey) === "tugas";
  const isLitnumTab = safeKey(selectedComponentKey) === "litnum";

  const presensiStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPresensiStudents = presensiStudents.slice(presensiStartIndex, presensiStartIndex + ITEMS_PER_PAGE);
  const presensiTotalPages = Math.ceil(presensiStudents.length / ITEMS_PER_PAGE);

  const litnumStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLitnumStudents = litnumStudents?.slice(litnumStartIndex, litnumStartIndex + ITEMS_PER_PAGE) || [];
  const litnumTotalPages = Math.ceil((litnumStudents?.length || 0) / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ClipboardList} title="Komponen Nilai" description="Input nilai komponen penilaian (ASTS, ASAS, Proyek, dll)" />

      <FilterBar config={{ showAcademicYear: true, showSemester: true, showGrade: true, showSubject: true }} academicYear={academicYear} onAcademicYearChange={setAcademicYear} semester={semester} onSemesterChange={setSemester} grade={grade} onGradeChange={setGrade} gradeDisabled={userRole === "guru"} selectedGS={selectedGS} onSelectedGSChange={setSelectedGS} gradeSubjects={gradeSubjects} />

      {/* Content */}
      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : initialLoading ? (
        <LoadingSkeleton rows={1} />
      ) : (!selectedGS || gradeSubjects.length === 0) ? (
        <EmptyState icon={ClipboardList} title="Belum ada Mapel untuk kelas ini." description="Silakan pilih Mata Pelajaran terlebih dahulu untuk melihat data." />
      ) : configLoading ? (
        <LoadingSkeleton type="pulse-table" rows={5} />
      ) : !config ? (
        <ErrorState variant="warning" error="Belum ada Konfigurasi Nilai aktif. Hubungi Admin untuk membuat Konfigurasi Nilai terlebih dahulu." />
      ) : (
        <>
          {/* Active config info */}
          {formulaComponents.length > 0 && (
            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl px-5 py-3">
              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-0.5">Konfigurasi Aktif:</p>
              <p className="text-sm font-semibold">
                <span className="text-indigo-700 dark:text-indigo-300">Nilai Akhir = </span>
                {formulaComponents.map((c, i) => (
                  <span key={c.key}>
                    {i > 0 && <span className="text-slate-400 dark:text-slate-500"> + </span>}
                    <span className={c.color}>{c.name} × {c.weight}%</span>
                  </span>
                ))}
              </p>
            </div>
          )}

          {/* Component tabs */}
          {components.length > 0 && (
            <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-full md:w-fit flex-wrap">
              {components.map((comp, i) => (
                <button
                  key={comp.key}
                  onClick={() => setSelectedComponentKey(comp.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    selectedComponentKey === comp.key
                      ? `bg-white dark:bg-gray-800 ${getTabColor(i)} shadow-sm`
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {comp.name}
                  {(safeKey(comp.key) === "harian" || safeKey(comp.key) === "karakter" || safeKey(comp.key) === "presensi" || safeKey(comp.key) === "tugas" || safeKey(comp.key) === "litnum") && " (Readonly)"}
                </button>
              ))}
            </div>
          )}

          {isHarianTab ? (
            <TabNilaiHarian
              paginatedStudents={paginatedStudents}
              harianScores={harianScores}
              harianLoading={harianLoading}
              handleScoreChange={handleScoreChange}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              totalStudents={students.length}
            />
          ) : isKarakterTab ? (
            <TabKarakter
              paginatedKarakterStudents={paginatedKarakterStudents}
              karakterLoading={karakterLoading}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentPage={currentPage}
              karakterTotalPages={karakterTotalPages}
              setCurrentPage={setCurrentPage}
              totalKarakterStudents={karakterStudents.length}
            />
          ) : isPresensiTab ? (
            <TabPresensi
              paginatedPresensiStudents={paginatedPresensiStudents}
              presensiLoading={presensiLoading}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentPage={currentPage}
              presensiTotalPages={presensiTotalPages}
              setCurrentPage={setCurrentPage}
              totalPresensiStudents={presensiStudents.length}
            />
          ) : isTugasTab ? (
            <TabTugas
              paginatedStudents={paginatedStudents}
              tugasScores={tugasScores}
              tugasLoading={tugasLoading}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              totalStudents={students.length}
            />
          ) : isLitnumTab ? (
            <TabLitnum
              paginatedLitnumStudents={paginatedLitnumStudents}
              litnumLoading={litnumLoading}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentPage={currentPage}
              litnumTotalPages={litnumTotalPages}
              setCurrentPage={setCurrentPage}
              totalLitnumStudents={litnumStudents?.length || 0}
            />
          ) : (
            <TabNonHarian
              nonHarianComponents={nonHarianComponents}
              selectedComponentKey={selectedComponentKey}
              setSelectedComponentKey={setSelectedComponentKey}
              paginatedStudents={paginatedStudents}
              nonHarianScores={nonHarianScores}
              nonHarianLoading={nonHarianLoading}
              handleScoreChange={handleScoreChange}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              selectedGS={selectedGS}
              getTabColor={getTabColor}
              saving={saving}
              onSave={onSave}
              totalStudents={students.length}
            />
          )}
        </>
      )}
    </div>
  );
}
