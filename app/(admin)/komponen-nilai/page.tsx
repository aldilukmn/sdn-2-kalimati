"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardList, Scale, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useAssessmentScore } from "@/hooks/useAssessmentScore";
import ErrorState from "@/app/components/shared/ErrorState";
import EmptyState from "@/app/components/shared/EmptyState";
import LoadingSkeleton from "@/app/components/shared/LoadingSkeleton";
import { usePagination } from "@/hooks/usePagination";
import { ITEMS_PER_PAGE, COMPONENT_COLORS, COMPONENT_BGS } from "@/lib/constants";
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

  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setShowConfig(true);
    }
  }, []);

  const onSave = async () => {
    const ok = await handleSave();
    if (ok) {
      toast.success("Nilai berhasil disimpan");
    } else {
      toast.error("Gagal menyimpan nilai");
    }
  };

  const formulaComponents = (config?.components
    ?.reduce((acc, c, i) => {
      if (c.weight > 0) {
        acc.push({ 
          ...c, 
          color: COMPONENT_COLORS[i % COMPONENT_COLORS.length],
          bgColor: COMPONENT_BGS[i % COMPONENT_BGS.length]
        });
      }
      return acc;
    }, [] as (AssessmentComponent & { color: string; bgColor: string })[]) || []);

  const getTabColor = (index: number) => COMPONENT_COLORS[index % COMPONENT_COLORS.length];

  const safeKey = (key: string) => key?.trim().toLowerCase() || "";
  
  const isHarianTab = safeKey(selectedComponentKey) === "harian";
  const isKarakterTab = safeKey(selectedComponentKey) === "karakter";
  const isPresensiTab = safeKey(selectedComponentKey) === "presensi";
  const isTugasTab = safeKey(selectedComponentKey) === "tugas";
  const isLitnumTab = safeKey(selectedComponentKey) === "litnum";

  const getActiveData = () => {
    if (isKarakterTab) return karakterStudents;
    if (isPresensiTab) return presensiStudents;
    if (isLitnumTab) return litnumStudents || [];
    return students;
  };

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination<any>(getActiveData(), ITEMS_PER_PAGE, [selectedComponentKey, selectedGS]);

  // Cast paginated data for specific tabs
  const paginatedStudents = paginatedData as typeof students;
  const paginatedKarakterStudents = paginatedData as typeof karakterStudents;
  const paginatedPresensiStudents = paginatedData as typeof presensiStudents;
  const paginatedLitnumStudents = paginatedData as NonNullable<typeof litnumStudents>;

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
            <div className="bg-white/80 dark:bg-gray-800/40 border border-indigo-100 dark:border-indigo-900/50 shadow-sm rounded-2xl p-4 md:p-5 relative overflow-hidden transition-all">
              <div 
                className="flex items-center justify-between relative z-10 cursor-pointer select-none group"
                onClick={() => setShowConfig(!showConfig)}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/70 transition-colors">
                    <Scale size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Konfigurasi Bobot Nilai Akhir
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase tracking-wider hidden sm:block">
                    Total 100%
                  </div>
                  <button className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                    {showConfig ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>
              
              <div className={`transition-all duration-300 ease-in-out flex flex-col gap-4 overflow-hidden ${showConfig ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}>
                {/* Stacked Progress Bar */}
                <div className="w-full h-3 flex rounded-full overflow-hidden relative z-10 bg-slate-100 dark:bg-slate-800/50 shadow-inner">
                  {formulaComponents.map((c) => (
                    <div
                      key={c.key}
                      className={`h-full ${c.bgColor} transition-all duration-500 border-r border-white/20 last:border-0`}
                      style={{ width: `${c.weight}%` }}
                      title={`${c.name} (${c.weight}%)`}
                    />
                  ))}
                </div>

                {/* Legend Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 relative z-10">
                  {formulaComponents.map((c) => (
                    <div key={c.key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.bgColor} shadow-sm`} />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{c.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{c.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Component tabs - Responsive (Dropdown Mobile, Chips Desktop) */}
          {components.length > 0 && (
            <div className="w-full">
              {/* Mobile View: Select Dropdown */}
              <div className="block md:hidden">
                <Select value={selectedComponentKey} onValueChange={(v) => v && setSelectedComponentKey(v)}>
                  <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 [&>span]:w-full [&>span]:text-left">
                    <SelectValue placeholder="Pilih Komponen Nilai">
                      {(() => {
                        const idx = components.findIndex(c => c.key === selectedComponentKey);
                        if (idx === -1) return "Pilih Komponen Nilai";
                        const comp = components[idx];
                        const activeBg = COMPONENT_BGS[idx % COMPONENT_BGS.length];
                        const isReadonly = (safeKey(comp.key) === "harian" || safeKey(comp.key) === "karakter" || safeKey(comp.key) === "presensi" || safeKey(comp.key) === "tugas" || safeKey(comp.key) === "litnum");
                        return (
                          <div className="flex items-center gap-2.5">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${activeBg}`} />
                            <span className="truncate flex-1">{comp.name}</span>
                            {isReadonly && <Lock size={14} className="text-slate-400 shrink-0 mr-2" />}
                          </div>
                        );
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {components.map((comp, idx) => {
                        const isReadonly = (safeKey(comp.key) === "harian" || safeKey(comp.key) === "karakter" || safeKey(comp.key) === "presensi" || safeKey(comp.key) === "tugas" || safeKey(comp.key) === "litnum");
                        const itemBg = COMPONENT_BGS[idx % COMPONENT_BGS.length];
                        return (
                          <SelectItem key={comp.key} value={comp.key}>
                            <div className="flex items-center gap-2.5">
                              <div className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${itemBg}`} />
                              <span>{comp.name}</span>
                              {isReadonly && <Lock size={12} className="text-slate-400 shrink-0" />}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop View: Minimalist Underline Tabs */}
              <div className="hidden md:flex flex-wrap gap-x-6 gap-y-2 px-1 border-b border-slate-200 dark:border-slate-800">
                {components.map((comp, i) => {
                  const isReadonly = (safeKey(comp.key) === "harian" || safeKey(comp.key) === "karakter" || safeKey(comp.key) === "presensi" || safeKey(comp.key) === "tugas" || safeKey(comp.key) === "litnum");
                  const isActive = selectedComponentKey === comp.key;
                  const activeBg = COMPONENT_BGS[i % COMPONENT_BGS.length];
                  const activeText = COMPONENT_COLORS[i % COMPONENT_COLORS.length];
                  
                  return (
                    <button
                      key={comp.key}
                      onClick={() => setSelectedComponentKey(comp.key)}
                      className={`
                        relative flex items-center gap-2 pb-3 pt-2 text-sm font-semibold transition-all duration-300
                        ${isActive 
                          ? activeText
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }
                      `}
                    >
                      <span>{comp.name}</span>
                      
                      {isReadonly && (
                        <div 
                          className={`flex items-center justify-center opacity-70 transition-colors ${isActive ? 'text-inherit' : 'text-slate-400'}`} 
                          title="Hanya Baca (Nilai ditarik otomatis)"
                        >
                          <Lock size={14} strokeWidth={2.5} />
                        </div>
                      )}

                      {/* Active Underline Indicator */}
                      {isActive && (
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-t-full ${activeBg}`} />
                      )}
                    </button>
                  )
                })}
              </div>
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
              karakterTotalPages={totalPages}
              setCurrentPage={setCurrentPage}
              totalKarakterStudents={karakterStudents.length}
            />
          ) : isPresensiTab ? (
            <TabPresensi
              paginatedPresensiStudents={paginatedPresensiStudents}
              presensiLoading={presensiLoading}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentPage={currentPage}
              presensiTotalPages={totalPages}
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
              litnumTotalPages={totalPages}
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
