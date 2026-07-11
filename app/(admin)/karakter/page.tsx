"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Save, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useCharacterAssessment } from "@/hooks/useCharacterAssessment";
import toast from "react-hot-toast";
import PageHero from "@/app/components/PageHero";
import StudentAssessmentTable from "@/app/components/karakter/StudentAssessmentTable";
import LoadingModal from "@/app/components/LoadingModal";
import Modal from "@/app/components/Modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function KarakterPage() {
  const router = useRouter();
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    month, setMonth,
    grade, setGrade,
    userRole,
    students, habits,
    scores, assessments,
    saving, loading, error, retry,
    hasChanges,
    handleScoreChange,
    handleSave,
    handleEdit,
    handleDelete,
    SEMESTERS, ACADEMIC_YEARS,
    MONTHS_ID, GRADES,
  } = useCharacterAssessment();

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

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
    router.push(`/karakter/detail?id=${assessmentId}`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ClipboardList} title="Penilaian Karakter" description="Input penilaian karakter siswa per bulan" />

      {/* Filter */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Bulan</label>
            <Select value={month} onValueChange={(v) => v && setMonth(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue placeholder="Pilih Bulan" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bulan</SelectLabel>
                  {MONTHS_ID.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Kelas</label>
            <Select value={grade} onValueChange={(v) => v && setGrade(v)} disabled={userRole === "guru"}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
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
      ) : !month || !grade ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <ClipboardList size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Pilih Bulan dan Kelas untuk memulai penilaian</p>
          </div>
        </div>
      ) : loading ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <ClipboardList size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Tidak ada siswa di kelas ini</p>
          </div>
        </div>
      ) : (
        <>
          {/* Habits info */}
          {habits.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Bobot nilai:</span>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">A = 4</span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">B = 3</span>
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">C = 2</span>
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">D = 1</span>

            </div>
          )}

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
          />

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={onSave}
              disabled={saving || !hasChanges}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
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
          </div>
        </>
      )}

      {/* Loading modal */}
      {saving && <LoadingModal isOpen={true} title="Menyimpan Penilaian" message="Mohon tunggu, data penilaian sedang disimpan..." loadingText="Jangan tutup halaman ini" />}

      {/* Delete confirmation modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Penilaian">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Yakin ingin menghapus penilaian karakter <strong>{deleteTarget?.name}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
