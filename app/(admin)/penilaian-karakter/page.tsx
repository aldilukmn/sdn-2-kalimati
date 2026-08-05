"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Save, Loader2, Trash2 } from "lucide-react";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import { useCharacterAssessment } from "@/hooks/useCharacterAssessment";
import toast from "react-hot-toast";
import PageHero from "@/components/layout/PageHero";
import StudentAssessmentTable from "@/components/karakter/StudentAssessmentTable";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/modals/Modal"), { ssr: false });
import FilterBar from "@/components/shared/FilterBar";
import TableSkeleton from '@/components/tables/TableSkeleton';
import ProgressBadge from "@/components/common/ProgressBadge";

export default function PenilaianKarakterPage() {
  const router = useRouter();
  const {
    semester,
    setSemester,
    academicYear,
    setAcademicYear,
    month,
    setMonth,
    grade,
    setGrade,
    role: userRole,
    students,
    habits,
    scores,
    assessments,
    saving,
    savingIds,
    loading,
    error,
    retry,
    hasChanges,
    handleScoreChange,
    handleSave,
    handleEdit,
    handleDelete,
    MONTHS_ID,
    currentPage,
    setCurrentPage,
    loadingScores,
  } = useCharacterAssessment();

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const onSave = async () => {
    if (!month) {
      toast.error("Pilih bulan terlebih dahulu");
      return;
    }
    try {
      await handleSave();
    } catch {
      // Handled in hook
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await handleDelete(deleteTarget.id, deleteTarget.name);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetail = (assessmentId: string) => {
    router.push(`/penilaian-karakter/detail?id=${assessmentId}`);
  };

  const totalCount = students.length;
  const completedCount = students.filter((s) => {
    const studentScores = scores[s.studentId];
    
    if (studentScores) {
      const filledHabits = habits.filter((h) => studentScores[h._id]).length;
      return filledHabits === habits.length && habits.length > 0;
    }
    
    if (assessments[s.studentId]) {
      return true;
    }
    
    return false;
  }).length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={ClipboardList}
        title="Penilaian Karakter"
        description="Input penilaian karakter murid per bulan"
      />

      <FilterBar
        config={{
          showAcademicYear: true,
          showSemester: true,
          showGrade: true,
          showMonth: true,
        }}
        academicYear={academicYear}
        onAcademicYearChange={setAcademicYear}
        semester={semester}
        onSemesterChange={setSemester}
        grade={grade}
        onGradeChange={setGrade}
        gradeDisabled={userRole?.toLowerCase() !== "admin"}
        month={month}
        onMonthChange={setMonth}
        months={MONTHS_ID}
      />

      {/* Content */}
      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : !month || !grade ? (
        <EmptyState
          icon={ClipboardList}
          title="Pilih Bulan dan Kelas untuk memulai penilaian"
        />
      ) : loading ? (
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md: border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
          <TableSkeleton headers={["No", "Nama", "Kebiasaan", "Aksi"]} rows={5} />
        </div>
      ) : students.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Tidak ada murid di kelas ini" />
      ) : (
        <>
          {/* Student table */}
          <StudentAssessmentTable
            students={students}
            habits={habits}
            scores={scores}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            loadingScores={loadingScores}
            existingAssessments={assessments}
            onScoreChange={handleScoreChange}
            onEdit={handleEdit}
            onDelete={(id, name) => setDeleteTarget({ id, name })}
            onViewDetail={handleViewDetail}
            savingIds={savingIds}
            headerSlot={
              habits.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                    role="status"
                    aria-label="Bobot nilai karakter"
                  >
                    <span className="font-medium">Bobot nilai:</span>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                      A = 4 (Sangat Baik)
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                      B = 3 (Baik)
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                      C = 2 (Memadai)
                    </span>
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                      D = 1 (Kurang)
                    </span>
                  </div>
                  
                  {/* Progress Badge */}
                  {totalCount > 0 && (
                    <ProgressBadge completed={completedCount} total={totalCount} />
                  )}
                </div>
              )
            }
          />
        </>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Hapus Penilaian"
        className="max-w-md"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Yakin ingin menghapus penilaian karakter{" "}
            <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Hapus
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
