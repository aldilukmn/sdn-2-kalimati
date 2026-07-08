"use client";

import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import {
  BookOpen, Plus, Pencil, Trash2, ChevronDown, ChevronRight,
  GripVertical, ArrowUp, ArrowDown, AlertCircle, Settings,
} from "lucide-react";
import { useChapters } from "@/hooks/useChapters";
import { decodeJWT } from "@/lib/jwt";
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

export default function MasterStrukturPage() {
  const initialToken = typeof window !== "undefined" ? sessionStorage.getItem("user_session") : null;
  const initialPayload = initialToken ? decodeJWT(initialToken) : null;
  const [userRole] = useState<string | null>(initialPayload?.role || null);
  const [userGrade] = useState<string | null>(initialPayload?.grade || null);

  const {
    gradeSubjects, selectedGS, setSelectedGS,
    chapters, materialsMap, expandedChapter, toggleExpandChapter,
    loading, error, retry, chaptersLoading, fetchMaterials,
    chapterModal, chapterName, setChapterName,
    chapterInputMode, setChapterInputMode, chapterSaving,
    openCreateChapter, openEditChapter, closeChapterModal, saveChapter, deleteChapter,
    materialModal, materialName, setMaterialName, materialSaving,
    openCreateMaterial, openEditMaterial, closeMaterialModal, saveMaterial, deleteMaterial,
  } = useChapters(userRole, userGrade);

  const [confirmDelete, setConfirmDelete] = useState<{
    type: "chapter" | "material";
    id: string;
    name: string;
    chapterId?: string;
  } | null>(null);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragOver = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDrop = useCallback(async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;
    const items = [...sortedChapters];
    const [removed] = items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, removed);
    const reorderPayload = items.map((ch, idx) => ({ _id: ch._id, order: idx + 1 }));
    try {
      const svc = (await import("@/services/chapter.service")).default;
      await svc.reorder(selectedGS, reorderPayload);
      toast.success("Urutan bab berhasil diperbarui");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal mengubah urutan");
    }
    dragItem.current = null;
    dragOverItem.current = null;
  }, [sortedChapters, selectedGS]);

  const handleSaveChapter = async () => {
    if (!chapterName.trim()) { toast.error("Nama bab tidak boleh kosong"); return; }
    try {
      await saveChapter();
      toast.success(chapterModal.edit ? "Bab berhasil diperbarui" : "Bab berhasil ditambahkan");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan bab");
    }
  };

  const handleDeleteChapter = async () => {
    if (!confirmDelete || confirmDelete.type !== "chapter") return;
    try {
      await deleteChapter(confirmDelete.id);
      toast.success("Bab berhasil dihapus");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus bab");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!confirmDelete || confirmDelete.type !== "material" || !confirmDelete.chapterId) return;
    try {
      await deleteMaterial(confirmDelete.chapterId, confirmDelete.id);
      toast.success("Materi berhasil dihapus");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus materi");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleSaveMaterial = async () => {
    if (!materialName.trim()) { toast.error("Nama materi tidak boleh kosong"); return; }
    try {
      await saveMaterial();
      toast.success(materialModal.edit ? "Materi berhasil diperbarui" : "Materi berhasil ditambahkan");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan materi");
    }
  };

  const selectedGSData = gradeSubjects.find((gs) => gs._id === selectedGS);

  const moveMaterial = async (chapterId: string, materials: { _id: string; name: string; order: number }[], index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= materials.length) return;
    const items = [...materials];
    const [removed] = items.splice(index, 1);
    items.splice(newIndex, 0, removed);
    const reorderPayload = items.map((m, idx) => ({ _id: m._id, order: idx + 1 }));
    try {
      const svc = (await import("@/services/material.service")).default;
      await svc.reorder(chapterId, reorderPayload);
      await fetchMaterials(chapterId);
      toast.success("Urutan materi berhasil diperbarui");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal mengubah urutan");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageHero icon={BookOpen} title="Struktur Akademik" description="Atur bab dan materi pelajaran" />
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle size={40} className="mx-auto text-red-300 dark:text-red-600 mb-3" />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button onClick={retry} className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageHero icon={BookOpen} title="Struktur Akademik" description="Atur bab dan materi pelajaran" />
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-64" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={BookOpen} title="Struktur Akademik" description="Atur bab dan materi pelajaran" />

      {/* Selector */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="w-full sm:w-72">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mata Pelajaran</label>
                <div className="flex items-center gap-2">
                  {userRole === "guru" && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">Kelas {userGrade}</span>
                  )}
                  {userRole !== null && userRole !== "guru" && (
                    <Link
                      href="/master-mapel"
                      className="text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <Settings size={12} />
                      Kelola Mapel
                    </Link>
                  )}
                </div>
              </div>
            <Select value={selectedGS} onValueChange={(v) => v && setSelectedGS(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih mapel">
                  {selectedGSData ? `${selectedGSData.subjectName || "-"} — Kelas ${selectedGSData.grade}` : "Pilih mapel"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {gradeSubjects.map((gs) => (
                  <SelectItem key={gs._id} value={gs._id}>
                    {gs.subjectName || "-"} — Kelas {gs.grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={openCreateChapter}
            disabled={!selectedGS}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Tambah Bab
          </button>
        </div>
      </div>

      {/* Chapter list */}
      {chaptersLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      ) : sortedChapters.length === 0 ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Bab.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Silakan buat Bab terlebih dahulu untuk mata pelajaran ini.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedChapters.map((chapter, idx) => {
            const materials = materialsMap[chapter._id] || [];
            const sortedMaterials = [...materials].sort((a, b) => a.order - b.order);

            return (
              <div
                key={chapter._id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={() => handleDragOver(idx)}
                onDrop={handleDrop}
                className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden transition-all"
              >
                {/* Chapter header */}
                <div className="flex items-center gap-2 px-4 py-3">
                  <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <GripVertical size={18} />
                  </div>
                  <button
                    onClick={() => {
                      toggleExpandChapter(chapter._id);
                    }}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {expandedChapter === chapter._id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">{chapter.name}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    chapter.inputMode === "per_material"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  }`}>
                    {chapter.inputMode === "per_material" ? "Per Materi" : "Per Bab"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditChapter(chapter)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
                      title="Ubah"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ type: "chapter", id: chapter._id, name: chapter.name })}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded: Materials */}
                {expandedChapter === chapter._id && (
                  <div className="border-t border-slate-100 dark:border-slate-700/50 px-4 py-3 pl-14 bg-slate-50/50 dark:bg-gray-900/30 space-y-2">
                    {chapter.inputMode === "per_material" ? (
                      <>
                        {sortedMaterials.length === 0 ? (
                          <p className="text-sm text-slate-400 dark:text-slate-500 italic">Belum ada Materi.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {sortedMaterials.map((mat, midx) => (
                              <div key={mat._id} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white dark:bg-gray-800/60 border border-slate-100 dark:border-slate-700/50">
                                <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{mat.name}</span>
                                <div className="flex items-center gap-0.5">
                                  <button
                                    onClick={() => moveMaterial(chapter._id, sortedMaterials, midx, -1)}
                                    disabled={midx === 0}
                                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 cursor-pointer"
                                    title="Naik"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={() => moveMaterial(chapter._id, sortedMaterials, midx, 1)}
                                    disabled={midx === sortedMaterials.length - 1}
                                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 cursor-pointer"
                                    title="Turun"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => openEditMaterial(chapter._id, mat)}
                                  className="p-1 rounded text-slate-400 hover:text-indigo-600 cursor-pointer"
                                  title="Ubah"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  onClick={() => setConfirmDelete({ type: "material", id: mat._id, name: mat.name, chapterId: chapter._id })}
                                  className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => openCreateMaterial(chapter._id)}
                          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium cursor-pointer"
                        >
                          <Plus size={14} />
                          Tambah Materi
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                        Bab ini menggunakan mode Per Bab — nilai langsung diinput tanpa materi.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Chapter */}
      <Modal open={chapterModal.open} onClose={closeChapterModal} title={chapterModal.edit ? "Ubah Bab" : "Tambah Bab"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Bab</label>
            <input
              type="text"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              placeholder="Masukkan nama bab"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveChapter(); }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Metode Input</label>
            <Select value={chapterInputMode} onValueChange={(v) => v && setChapterInputMode(v as "per_chapter" | "per_material")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_material">Per Materi (sub-bab)</SelectItem>
                <SelectItem value="per_chapter">Per Bab (langsung)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {chapterInputMode === "per_material"
                ? "Guru akan input nilai per materi/sub-bab"
                : "Guru akan input nilai langsung per bab (tanpa materi)"}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={closeChapterModal} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">Batal</button>
            <button
              onClick={handleSaveChapter}
              disabled={chapterSaving || !chapterName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              {chapterSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {chapterModal.edit ? "Simpan" : "Tambah"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Material */}
      <Modal open={materialModal.open} onClose={closeMaterialModal} title={materialModal.edit ? "Ubah Materi" : "Tambah Materi"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Materi</label>
            <input
              type="text"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="Masukkan nama materi"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveMaterial(); }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={closeMaterialModal} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">Batal</button>
            <button
              onClick={handleSaveMaterial}
              disabled={materialSaving || !materialName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              {materialSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {materialModal.edit ? "Simpan" : "Tambah"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Konfirmasi Hapus">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Yakin ingin menghapus {confirmDelete?.type === "chapter" ? "bab" : "materi"} <strong>{confirmDelete?.name}</strong>?
          <span className="block mt-1 text-xs text-slate-400">
            {confirmDelete?.type === "chapter"
              ? "Tidak bisa dihapus jika masih memiliki data nilai."
              : "Tidak bisa dihapus jika masih memiliki data nilai."}
          </span>
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">Batal</button>
          <button
            onClick={confirmDelete?.type === "chapter" ? handleDeleteChapter : handleDeleteMaterial}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
}
