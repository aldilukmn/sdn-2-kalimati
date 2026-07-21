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
    loading,
    error,
    retry,
    hasChanges,
    handleScoreChange,
    handleSave,
    handleEdit,
    handleDelete,
    MONTHS_ID,
  } = useCharacterAssessment();

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
    await handleDelete(deleteTarget.id, deleteTarget.name);
    setDeleteTarget(null);
  };

  const handleViewDetail = (assessmentId: string) => {
    router.push(`/penilaian-karakter/detail?id=${assessmentId}`);
  };

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
        gradeDisabled={userRole === "guru"}
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
            existingAssessments={assessments}
            onScoreChange={handleScoreChange}
            onEdit={handleEdit}
            onDelete={(id, name) => setDeleteTarget({ id, name })}
            onViewDetail={handleViewDetail}
            saving={saving}
            headerSlot={
              habits.length > 0 && (
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
              )
            }
            saveButton={
              <button
                onClick={onSave}
                disabled={saving || !hasChanges}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Simpan Penilaian
                  </>
                )}
              </button>
            }
          />
        </>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Penilaian"
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
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
