"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useSubjects } from "@/hooks/useSubjects";
import toast from "react-hot-toast";
import PageHero from "@/components/layout/PageHero";
import SubjectModal from "./components/SubjectModal";
import AssignModal from "./components/AssignModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import SubjectsTab from "./components/SubjectsTab";
import AssignTab from "./components/AssignTab";

export default function MasterMapelPage() {
  const {
    subjects,
    filteredSubjects,
    gradeSubjects,
    loading,
    error,
    retry,
    search,
    setSearch,
    subjectModal,
    subjectName,
    setSubjectName,
    subjectSaving,
    openCreateSubject,
    openEditSubject,
    closeSubjectModal,
    saveSubject,
    deleteSubject,
    assignModal,
    assignSubjectId,
    setAssignSubjectId,
    assignGrades,
    toggleGrade,
    assignSemester,
    setAssignSemester,
    assignAcademicYear,
    setAssignAcademicYear,
    assignSaving,
    openAssignModal,
    closeAssignModal,
    saveAssign,
    deleteGradeSubject,
  } = useSubjects();

  const [activeTab, setActiveTab] = useState<"subjects" | "assign">("subjects");
  const [confirmDelete, setConfirmDelete] = useState<{ type: "subject" | "gradeSubject"; id: string; name: string } | null>(null);

  const handleSaveSubject = async () => {
    if (!subjectName.trim()) {
      toast.error("Nama mata pelajaran tidak boleh kosong");
      return;
    }
    try {
      await saveSubject();
      toast.success(subjectModal.edit ? "Mata pelajaran berhasil diperbarui" : "Mata pelajaran berhasil ditambahkan");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan mata pelajaran");
    }
  };

  const handleDeleteSubject = async () => {
    if (!confirmDelete || confirmDelete.type !== "subject") return;
    try {
      await deleteSubject(confirmDelete.id);
      toast.success("Mata pelajaran berhasil dihapus");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus mata pelajaran");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleDeleteGradeSubject = async () => {
    if (!confirmDelete || confirmDelete.type !== "gradeSubject") return;
    try {
      await deleteGradeSubject(confirmDelete.id);
      toast.success("Penetapan berhasil dihapus");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus penetapan");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleSaveAssign = async () => {
    if (!assignSubjectId) {
      toast.error("Pilih mata pelajaran terlebih dahulu");
      return;
    }
    if (assignGrades.length === 0) {
      toast.error("Pilih minimal satu kelas");
      return;
    }
    try {
      await saveAssign();
      toast.success(`Mata pelajaran berhasil ditetapkan ke ${assignGrades.length} kelas`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menetapkan mata pelajaran");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={BookOpen} title="Kelola Mapel" description="Kelola mata pelajaran dan penetapan ke kelas" />

      {/* Back link */}
      <Link
        href="/daftar-mapel"
        className="flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium -mt-2"
      >
        <ArrowLeft size={14} />
        Kembali ke Daftar Mapel
      </Link>

      {/* Tab */}
      <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-full md:w-fit">
        <button
          onClick={() => setActiveTab("subjects")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "subjects"
              ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
          }`}
        >
          Daftar Mapel
        </button>
        <button
          onClick={() => setActiveTab("assign")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "assign"
              ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
          }`}
        >
          Tetapkan ke Kelas
        </button>
      </div>

      {activeTab === "subjects" && (
        <SubjectsTab
          search={search}
          setSearch={setSearch}
          openCreateSubject={openCreateSubject}
          error={error}
          retry={retry}
          loading={loading}
          filteredSubjects={filteredSubjects}
          openEditSubject={openEditSubject}
          setConfirmDelete={setConfirmDelete}
        />
      )}

      {activeTab === "assign" && (
        <AssignTab
          error={error}
          retry={retry}
          loading={loading}
          gradeSubjects={gradeSubjects}
          openAssignModal={openAssignModal}
          setConfirmDelete={setConfirmDelete}
        />
      )}

      <SubjectModal
        open={subjectModal.open}
        onClose={closeSubjectModal}
        subjectModal={subjectModal}
        subjectName={subjectName}
        setSubjectName={setSubjectName}
        subjectSaving={subjectSaving}
        handleSaveSubject={handleSaveSubject}
      />

      <AssignModal
        open={assignModal}
        onClose={closeAssignModal}
        assignSubjectId={assignSubjectId}
        setAssignSubjectId={setAssignSubjectId}
        subjects={subjects}
        assignGrades={assignGrades}
        toggleGrade={toggleGrade}
        assignSemester={assignSemester}
        setAssignSemester={setAssignSemester}
        assignAcademicYear={assignAcademicYear}
        setAssignAcademicYear={setAssignAcademicYear}
        assignSaving={assignSaving}
        handleSaveAssign={handleSaveAssign}
      />

      <ConfirmDeleteModal
        confirmDelete={confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDelete?.type === "subject" ? handleDeleteSubject : handleDeleteGradeSubject}
      />
    </div>
  );
}
