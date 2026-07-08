"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, Search, X, AlertCircle, ArrowLeft } from "lucide-react";
import { useSubjects } from "@/hooks/useSubjects";
import { GRADES } from "@/lib/constants";
import toast from "react-hot-toast";
import Modal from "@/app/components/Modal";
import PageHero from "@/app/components/PageHero";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];

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
    assignGrade,
    setAssignGrade,
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
    try {
      await saveAssign();
      toast.success("Mata pelajaran berhasil ditetapkan ke kelas");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menetapkan mata pelajaran");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={BookOpen} title="Master Mapel" description="Kelola mata pelajaran dan penetapan ke kelas" />

      {/* Back link */}
      <Link
        href="/master-struktur"
        className="flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium -mt-2"
      >
        <ArrowLeft size={14} />
        Kembali ke Struktur Akademik
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
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          {/* Search + Add */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari mata pelajaran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={openCreateSubject}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Tambah Mapel
            </button>
          </div>

          {/* Table */}
          {error ? (
            <div className="text-center py-12">
              <AlertCircle size={40} className="mx-auto text-red-300 dark:text-red-600 mb-3" />
              <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
              <button onClick={retry} className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                Coba Lagi
              </button>
            </div>
          ) : loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
              ))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {search ? "Tidak ada mata pelajaran yang cocok" : "Belum ada Mata Pelajaran."}
              </p>
              {!search && (
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                  Silakan tambahkan Mata Pelajaran terlebih dahulu.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-indigo-700 hover:bg-indigo-700">
                    <TableHead className="text-white">No</TableHead>
                    <TableHead className="text-white">Nama Mapel</TableHead>
                    <TableHead className="text-white text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject, index) => (
                    <TableRow key={subject._id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium text-slate-600 dark:text-slate-300">{index + 1}</TableCell>
                      <TableCell className="text-slate-800 dark:text-slate-200 font-medium">{subject.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditSubject(subject)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
                            title="Ubah"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ type: "subject", id: subject._id, name: subject.name })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {activeTab === "assign" && (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="flex justify-end mb-4">
            <button
              onClick={openAssignModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Tetapkan Mapel
            </button>
          </div>

          {error ? (
            <div className="text-center py-12">
              <AlertCircle size={40} className="mx-auto text-red-300 dark:text-red-600 mb-3" />
              <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
              <button onClick={retry} className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                Coba Lagi
              </button>
            </div>
          ) : loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
              ))}
            </div>
          ) : gradeSubjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Belum ada Mata Pelajaran yang ditetapkan ke kelas ini.
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                Tetapkan mata pelajaran terlebih dahulu.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-indigo-700 hover:bg-indigo-700">
                    <TableHead className="text-white">No</TableHead>
                    <TableHead className="text-white">Mapel</TableHead>
                    <TableHead className="text-white">Kelas</TableHead>
                    <TableHead className="text-white">Semester</TableHead>
                    <TableHead className="text-white">Tahun Ajaran</TableHead>
                    <TableHead className="text-white text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradeSubjects.map((gs, index) => (
                    <TableRow key={gs._id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium text-slate-600 dark:text-slate-300">{index + 1}</TableCell>
                      <TableCell className="text-slate-800 dark:text-slate-200 font-medium">{gs.subjectName || "-"}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">Kelas {gs.grade}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">Semester {gs.semester}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">{gs.academicYear}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => setConfirmDelete({ type: "gradeSubject", id: gs._id, name: gs.subjectName || gs._id })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Modal Subject */}
      <Modal open={subjectModal.open} onClose={closeSubjectModal} title={subjectModal.edit ? "Ubah Mata Pelajaran" : "Tambah Mata Pelajaran"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Mata Pelajaran</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Masukkan nama mata pelajaran"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveSubject(); }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeSubjectModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSaveSubject}
              disabled={subjectSaving || !subjectName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              {subjectSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {subjectModal.edit ? "Simpan" : "Tambah"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Assign */}
      <Modal open={assignModal} onClose={closeAssignModal} title="Tetapkan Mata Pelajaran ke Kelas">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran</label>
            <Select value={assignSubjectId} onValueChange={(v) => v && setAssignSubjectId(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih mapel">
                  {assignSubjectId ? subjects.find(s => s._id === assignSubjectId)?.name : "Pilih mapel"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
            <Select value={assignGrade} onValueChange={(v) => v && setAssignGrade(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Semester</label>
            <Select value={assignSemester} onValueChange={(v) => v && setAssignSemester(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih semester" />
              </SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tahun Ajaran</label>
            <Select value={assignAcademicYear} onValueChange={(v) => v && setAssignAcademicYear(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tahun ajaran" />
              </SelectTrigger>
              <SelectContent>
                {ACADEMIC_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeAssignModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSaveAssign}
              disabled={assignSaving || !assignSubjectId}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              {assignSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Tetapkan
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Konfirmasi Hapus">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Yakin ingin menghapus{confirmDelete?.type === "subject" ? " mata pelajaran" : " penetapan"} <strong>{confirmDelete?.name}</strong>?
          {confirmDelete?.type === "subject" && (
            <span className="block mt-1 text-xs text-slate-400">
              Tidak bisa dihapus jika masih terdaftar di kelas.
            </span>
          )}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={confirmDelete?.type === "subject" ? handleDeleteSubject : handleDeleteGradeSubject}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
}
