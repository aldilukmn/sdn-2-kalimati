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
  Loader2,
  Check,
  MoreVertical,
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
import { motion } from "framer-motion";

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
    savingIds,
    activeStudentId,
    setActiveStudentId,
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
  const sortedTasks = [...tasks].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
  const paginatedTasks = sortedTasks.slice(tasksStartIndex, tasksStartIndex + ITEMS_PER_PAGE);
  const tasksTotalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTaskId]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  const activeInputtedCount = useMemo(() => {
    if (!selectedTaskId) return 0;
    return Object.values(scoreInputs).filter((val) => val !== undefined && val.trim() !== "").length;
  }, [selectedTaskId, scoreInputs]);

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
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">
              Daftar Penilaian
            </h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAdd}
              disabled={loading || saving}
              className="flex items-center justify-center gap-2 w-9 h-9 p-0 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed border-0 outline-none focus:outline-none"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Tambah Penilaian</span>
            </motion.button>
          </div>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="Belum ada data"
                description="Klik Tambah Penilaian untuk membuat data baru"
              />
            ) : (
              paginatedTasks.map((t: any, index: number) => {
                const isActive = selectedTaskId === t._id;
                const currentInputted = isActive ? (scoresLoading ? (t.inputtedCount ?? 0) : activeInputtedCount) : (t.inputtedCount ?? 0);
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
                      <span className="hidden sm:inline text-lg shrink-0">
                        {isActive ? "📘" : "📕"}
                      </span>
                      <span
                        className={`text-sm font-medium truncate ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}
                        title={t.name}
                      >
                        {tasksStartIndex + index + 1}. {t.name}
                      </span>
                      {t.createdAt && (
                        <span className="hidden sm:inline text-xs font-normal opacity-70 shrink-0">
                          ({new Date(t.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Desktop: progress bar */}
                      {!isActive && (
                        <div className="hidden sm:flex items-center gap-2 flex-1 sm:flex-none">
                          {students.length > 0 && (
                            <div className="w-24 sm:w-28 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shrink-0">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  currentInputted >= students.length
                                    ? "bg-emerald-500"
                                    : currentInputted > 0
                                    ? "bg-amber-500"
                                    : "bg-slate-300 dark:bg-slate-600"
                                }`}
                                style={{ width: `${students.length > 0 ? (currentInputted / students.length) * 100 : 0}%` }}
                              />
                            </div>
                          )}
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {currentInputted}/{students.length}
                          </span>
                          {currentInputted >= students.length && students.length > 0 && (
                            <span className="inline-flex items-center text-[11px] font-semibold p-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" title="Semua nilai tersimpan">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                      )}
                      {/* Mobile: icon indicator & date */}
                      <div className="sm:hidden flex items-center gap-1.5">
                        {t.createdAt && (
                          <span className="text-[10px] font-normal opacity-70">
                            ({new Date(t.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "numeric",
                              year: "2-digit",
                            })})
                          </span>
                        )}
                        {!isActive && (
                          currentInputted >= students.length && students.length > 0 ? (
                            <span 
                              title="Semua nilai tersimpan"
                              className="inline-flex items-center text-[11px] font-semibold p-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            >
                              <Check size={12} strokeWidth={3} />
                            </span>
                          ) : (
                            <span 
                              title={`${currentInputted} dari ${students.length} nilai tersimpan`}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {currentInputted}/{students.length}
                            </span>
                          )
                        )}
                      </div>
                      {/* Desktop actions */}
                      <div className="hidden sm:flex items-center gap-1">
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
                      </div>

                      {/* Mobile action menu */}
                      <div className="sm:hidden relative">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === t._id ? null : t._id);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-700 active:bg-slate-300 transition-colors cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </div>
                        {openMenuId === t._id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                              }}
                            />
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-150">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  openEdit(t);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer"
                              >
                                <Pencil size={14} className="text-slate-400" /> Edit
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  setConfirmDelete(t._id);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 cursor-pointer"
                              >
                                <Trash2 size={14} className="opacity-80" /> Hapus
                              </div>
                            </div>
                          </>
                        )}
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
                totalItems={tasks.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
          </div>

          {selectedTask && (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
              <div className="flex flex-row items-center justify-between gap-4 mb-4 w-full">
                <h2 className="font-semibold text-slate-700 dark:text-slate-200 truncate flex-1 min-w-0" title={selectedTask.name}>
                  {selectedTask.name}
                </h2>
                
                <div className="shrink-0 flex justify-end items-center gap-3">
                  <div className="flex flex-col bg-white dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800/60 rounded-md overflow-hidden shadow-sm w-[110px] sm:w-[150px]">
                    {/* Text Content */}
                    <div className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-center whitespace-nowrap">
                      {activeInputtedCount}/{students.length} murid <span className="ml-1 opacity-80">({students.length > 0 ? Math.round((activeInputtedCount / students.length) * 100) : 0}%)</span>
                    </div>
                    {/* Tiny Progress Bar Inside Badge */}
                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-700/50">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          activeInputtedCount >= students.length && students.length > 0
                            ? "bg-emerald-500"
                            : "bg-indigo-500 dark:bg-indigo-400"
                        }`}
                        style={{ width: `${students.length > 0 ? (activeInputtedCount / students.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm text-center">
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
                              className={`border-b transition-colors relative ${
                                savingIds.includes(s.studentId)
                                  ? "border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/80 dark:bg-indigo-900/20 opacity-60 animate-pulse"
                                  : "border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                              }`}
                            >
                              <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">
                                {startIndex + i + 1}
                              </td>
                              <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap">
                                {s.name}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <div className="relative inline-block">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    disabled={savingIds.includes(s.studentId)}
                                    value={scoreInputs[s.studentId] ?? ""}
                                    onChange={(e) =>
                                      updateScoreInput(
                                        s.studentId,
                                        e.target.value,
                                      )
                                    }
                                    onFocus={() => setActiveStudentId(s.studentId)}
                                    onBlur={() => setActiveStudentId(null)}
                                    className="w-fit px-0 mx-auto block text-center rounded-lg border border-slate-300 bg-slate-50 py-1.5 text-sm focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:border-slate-300 dark:disabled:border-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:opacity-80 disabled:cursor-not-allowed transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span
                                  className={`inline-flex items-center text-[11px] font-semibold p-1 rounded-full ${
                                    savingIds.includes(s.studentId)
                                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                                      : isSaved
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                  }`}
                                >
                                  {savingIds.includes(s.studentId) ? (
                                    <span
                                      title="Menyimpan..."
                                      className="inline-flex items-center"
                                    >
                                      <Loader2 size={16} className="animate-spin" />
                                    </span>
                                  ) : isSaved ? (
                                    <span
                                      title="Tersimpan"
                                      className="inline-flex items-center"
                                    >
                                      <Check size={16} strokeWidth={3} />
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
