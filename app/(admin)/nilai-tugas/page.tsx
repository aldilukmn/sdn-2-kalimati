"use client";

import { useState, useMemo } from "react";
import { ClipboardEdit, Plus, Pencil, Trash2, Save, FileText } from "lucide-react";
import PageHero from "@/app/components/PageHero";
import FilterBar from "@/app/components/shared/FilterBar";
import LoadingSkeleton from "@/app/components/shared/LoadingSkeleton";
import Modal from "@/app/components/Modal";
import { useTugas } from "@/hooks/useTugas";

export default function NilaiTugasPage() {
  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    SEMESTERS, ACADEMIC_YEARS,
    grade, setGrade, GRADES,
    subjects, subjectId, setSubjectId,
    tasks, selectedTaskId, setSelectedTaskId,
    students, scoreInputs,
    loading, initialLoading, error,
    addTask, editTask, removeTask,
    saveScores, updateScoreInput,
  } = useTugas();

  const [taskModal, setTaskModal] = useState<{ mode: "add" | "edit"; id?: string; name?: string } | null>(null);
  const [taskName, setTaskName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const selectedTask = useMemo(() => tasks.find((t) => t._id === selectedTaskId), [tasks, selectedTaskId]);

  const openAdd = () => {
    setTaskName("");
    setTaskModal({ mode: "add" });
  };

  const openEdit = (t: { _id: string; name: string }) => {
    setTaskName(t.name);
    setTaskModal({ mode: "edit", id: t._id, name: t.name });
  };

  const handleTaskSubmit = async () => {
    if (!taskName.trim()) return;
    if (taskModal?.mode === "add") {
      await addTask(taskName.trim());
    } else if (taskModal?.mode === "edit" && taskModal.id) {
      await editTask(taskModal.id, taskName.trim());
    }
    setTaskModal(null);
    setTaskName("");
  };

  const handleDelete = async (id: string) => {
    await removeTask(id);
    setConfirmDelete(null);
  };

  if (initialLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl h-24 animate-pulse" />
        <LoadingSkeleton rows={2} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHero
        icon={ClipboardEdit}
        title="Nilai Tugas"
        description="Kelola tugas dan input nilai"
      />

      <FilterBar
        config={{ showAcademicYear: true, showSemester: true, showGrade: true, showSubject: true }}
        academicYear={academicYear}
        onAcademicYearChange={setAcademicYear}
        semester={semester}
        onSemesterChange={setSemester}
        grade={grade}
        onGradeChange={setGrade}
        gradeDisabled={false}
        selectedGS={subjectId}
        onSelectedGSChange={setSubjectId}
        gradeSubjects={subjects.map((s) => ({ _id: s._id, subjectName: s.subjectName }))}
        subjectPlaceholder="Pilih Mapel"
      />

      {!subjectId && (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-8 text-center">
          <FileText size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Pilih mata pelajaran untuk mulai mengelola tugas</p>
        </div>
      )}

      {subjectId && (
        <>
          <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-700 dark:text-slate-200">Daftar Tugas</h2>
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors cursor-pointer"
              >
                <Plus size={16} />
                Tambah
              </button>
            </div>
            {tasks.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">Belum ada tugas. Klik &quot;Tambah&quot; untuk membuat tugas baru.</p>
            ) : (
              <div className="space-y-1">
                {tasks.map((t) => (
                  <div
                    key={t._id}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                      selectedTaskId === t._id
                        ? "bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-300 dark:border-indigo-700"
                        : "hover:bg-slate-100 dark:hover:bg-gray-700/50 border border-transparent"
                    }`}
                    onClick={() => setSelectedTaskId(t._id)}
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-200">{t.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(t); }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(t._id); }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedTask && (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-700 dark:text-slate-200">
                  Input Nilai — {selectedTask.name}
                </h2>
                <button
                  onClick={saveScores}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-xl transition-colors cursor-pointer"
                >
                  <Save size={16} />
                  Simpan
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left p-3 text-slate-500 dark:text-slate-400 font-medium">No</th>
                      <th className="text-left p-3 text-slate-500 dark:text-slate-400 font-medium">NIS</th>
                      <th className="text-left p-3 text-slate-500 dark:text-slate-400 font-medium">Nama</th>
                      <th className="text-center p-3 text-slate-500 dark:text-slate-400 font-medium">Nilai (0-100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-3 text-slate-500 dark:text-slate-400">{i + 1}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{s.studentId}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-200 font-medium">{s.name}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={scoreInputs[s.studentId] ?? ""}
                            onChange={(e) => updateScoreInput(s.studentId, e.target.value)}
                            className="w-24 mx-auto block text-center rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={taskModal !== null} onClose={() => { setTaskModal(null); setTaskName(""); }} title={taskModal?.mode === "add" ? "Tambah Tugas" : "Edit Tugas"}>
        <div className="space-y-3">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Nama tugas"
            className="w-full rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            autoFocus
          />
          <button
            onClick={handleTaskSubmit}
            disabled={!taskName.trim()}
            className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {taskModal?.mode === "add" ? "Tambah" : "Simpan"}
          </button>
        </div>
      </Modal>

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Hapus Tugas">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Yakin ingin menghapus tugas ini? Semua nilai terkait juga akan terhapus.</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-gray-600 text-sm hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => confirmDelete && handleDelete(confirmDelete)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm transition-colors cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
}
