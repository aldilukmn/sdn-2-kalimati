"use client";

import { useState, useMemo, useEffect } from "react";
import {
  PieChart,
  Plus,
  Pencil,
  Trash2,
  Save,
  FileText,
  ClipboardList,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import FilterBar from "@/components/shared/FilterBar";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/modals/Modal"), { ssr: false });
import Pagination from "@/components/common/Pagination";
import { useLitnum } from "@/hooks/useLitnum";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export default function NilaiLitnumPage() {
  const {
    role,
    semester,
    setSemester,
    academicYear,
    setAcademicYear,
    grade,
    setGrade,
    availableGrades,
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    scores,
    students,
    scoreInputs,
    loading,
    initialLoading,
    scoresLoading,
    saving,
    error,
    addTask,
    editTask,
    removeTask,
    saveScores,
    updateScoreInput,
  } = useLitnum();

  const [taskModal, setTaskModal] = useState<{
    mode: "add" | "edit";
    id?: string;
    name?: string;
  } | null>(null);
  const [taskName, setTaskName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTask = useMemo(
    () => tasks.find((t) => t._id === selectedTaskId),
    [tasks, selectedTaskId],
  );

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);

  const [tasksPage, setTasksPage] = useState(1);
  const tasksStartIndex = (tasksPage - 1) * ITEMS_PER_PAGE;
  const paginatedTasks = tasks.slice(tasksStartIndex, tasksStartIndex + ITEMS_PER_PAGE);
  const tasksTotalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTaskId]);

  const openAdd = () => {
    setTaskName("");
    setTaskModal({ mode: "add" });
  };

  const openEdit = (t: { _id: string; name: string }) => {
    setTaskName(t.name);
    setTaskModal({ mode: "edit", id: t._id, name: t.name });
  };

  const handleTaskSubmit = async () => {
    if (!taskName.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (taskModal?.mode === "add") {
        await addTask(taskName.trim());
      } else if (taskModal?.mode === "edit" && taskModal.id) {
        await editTask(taskModal.id, taskName.trim());
      }
      setTaskModal(null);
      setTaskName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await removeTask(id);
      setConfirmDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={PieChart}
        title="Nilai Literasi & Numerasi"
        description="Kelola dan input nilai LitNum (bersifat global per kelas)"
      />

      <FilterBar
        config={{
          showAcademicYear: true,
          showSemester: true,
          showGrade: true,
        }}
        academicYear={academicYear}
        onAcademicYearChange={setAcademicYear}
        semester={semester}
        onSemesterChange={setSemester}
        grade={grade}
        onGradeChange={setGrade}
        gradeDisabled={role === "guru"}
        availableGrades={availableGrades}
        gridClassName="grid-cols-2 md:grid-cols-3"
        gradeClassName="col-span-2 md:col-span-1"
      />

      {error ? (
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      ) : initialLoading ? (
        <LoadingSkeleton rows={1} />
      ) : !grade ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-8 text-center">
          <FileText
            size={40}
            className="mx-auto text-slate-300 dark:text-slate-600 mb-3"
          />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Pilih kelas untuk mulai mengelola nilai literasi & numerasi
          </p>
        </div>
      ) : loading ? (
        <LoadingSkeleton rows={1} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">
              Daftar Penilaian
            </h2>
            <button
              onClick={openAdd}
              disabled={loading || saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Tambah Penilaian
            </button>
          </div>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="Belum ada penilaian"
                description="Klik Tambah Penilaian untuk membuat sub-penilaian LitNum"
              />
            ) : (
              paginatedTasks.map((t, index) => {
                const isActive = selectedTaskId === t._id;
                return (
                  <button
                    key={t._id}
                    onClick={() => setSelectedTaskId(t._id)}
                    disabled={saving}
                    className={`w-full text-left flex flex-row items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer disabled:cursor-not-allowed ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700"
                        : "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-750 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-md "
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg shrink-0">
                        {isActive ? "📘" : "📕"}
                      </span>
                      <span
                        className={`text-sm font-medium truncate ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}
                      >
                        {tasksStartIndex + index + 1}. {t.name}
                        {t.createdAt && (
                          <span className="text-xs font-normal opacity-70 ml-2">
                            ({new Date(t.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })})
                          </span>
                        )}
                      </span>
                      <div className="ml-2 flex items-center">
                        {(t.inputtedCount ?? 0) >= students.length && students.length > 0 ? (
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
                            title={`${t.inputtedCount ?? 0} dari ${students.length} nilai tersimpan`}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {t.inputtedCount ?? 0}/{students.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(t);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        <Pencil size={14} />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(t._id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </div>
                      {isActive && (
                        <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium shrink-0 ml-2 hidden sm:inline">
                          (Sedang aktif)
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
          {tasksTotalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={tasksPage}
                totalPages={tasksTotalPages}
                onPageChange={setTasksPage}
              />
            </div>
          )}

          {selectedTask && (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-700 dark:text-slate-200">
                  Input Nilai: {selectedTask.name}
                </h2>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm text-center">
                      <th className="px-4 py-3 font-semibold w-12 whitespace-nowrap">
                        No
                      </th>
                      <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                        Nama
                      </th>
                      <th className="px-4 py-3 font-semibold w-32 whitespace-nowrap">
                        Nilai (0-100)
                      </th>
                      <th className="px-4 py-3 font-semibold w-24 whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoresLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <tr
                            key={`skel-${i}`}
                            className="border-b border-slate-100 dark:border-slate-800"
                          >
                            <td colSpan={5} className="p-3">
                              <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                            </td>
                          </tr>
                        ))
                      : paginatedStudents.map((s, i) => {
                          const originalScore = scores.find(
                            (score) => score.studentId === s.studentId,
                          );
                          const currentVal = scoreInputs[s.studentId];
                          const isSaved =
                            originalScore &&
                            String(originalScore.score) === currentVal;
                          return (
                            <tr
                              key={s.studentId}
                              className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                              <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">
                                {startIndex + i + 1}
                              </td>
                              <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap">
                                {s.name}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  disabled={saving}
                                  value={scoreInputs[s.studentId] ?? ""}
                                  onChange={(e) =>
                                    updateScoreInput(
                                      s.studentId,
                                      e.target.value,
                                    )
                                  }
                                  className="w-fit px-0 mx-auto block text-center rounded-lg border border-slate-300 bg-slate-50 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                                />
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span
                                  className={`inline-flex items-center text-[11px] font-semibold p-1.5 rounded-full ${
                                    isSaved
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                  }`}
                                >
                                  {isSaved ? (
                                    <span
                                      title="Tersimpan"
                                      className="inline-flex items-center"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="m9 12 2 2 4-4" />
                                      </svg>
                                    </span>
                                  ) : (
                                    <span
                                      title="Belum simpan"
                                      className="inline-flex items-center"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                      </svg>
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
              {students.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={students.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
                </div>
              )}

              <button
                onClick={saveScores}
                disabled={
                  saving || loading || scoresLoading || students.length === 0
                }
                className="mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors cursor-pointer w-full"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Menyimpan..." : "Simpan Semua Nilai"}
              </button>
            </div>
          )}
        </>
      )}

      <Modal
        className="max-w-md"
        open={taskModal !== null}
        onClose={() => {
          setTaskModal(null);
          setTaskName("");
        }}
        title={taskModal?.mode === "add" ? "Tambah Penilaian" : "Edit Penilaian"}
      >
        <div className="space-y-3">
          <input
            type="text"
            value={taskName}
            disabled={isSubmitting}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Masukkan nama penilaian"
            className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400 disabled:opacity-50 transition-colors"
            autoFocus
          />
          <button
            onClick={handleTaskSubmit}
            disabled={!taskName.trim() || isSubmitting}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 text-white text-sm rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : taskModal?.mode === "add" ? (
              "Tambah"
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </Modal>

      <Modal
        className="max-w-md"
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Hapus Penilaian"
      >
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Yakin ingin menghapus penilaian ini? Semua nilai terkait juga akan
          terhapus.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            disabled={isSubmitting}
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-gray-600 text-sm text-gray-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => confirmDelete && handleDelete(confirmDelete)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
