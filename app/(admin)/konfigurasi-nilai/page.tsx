"use client";

import { AlertCircle, Plus, Save, Trash2, Scale } from "lucide-react";
import { useAssessmentConfig } from "@/hooks/useAssessmentConfig";
import { GRADES } from "@/lib/constants";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import PageHero from "@/app/components/PageHero";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MasterKonfigurasiNilaiPage() {
  const {
    grade, setGrade,
    configs, loading, error, retry,
    modalOpen, editingConfig, openCreateModal, openEditModal, closeModal,
    modalGrade, setModalGrade,
    modalSemester, setModalSemester,
    modalAcademicYear, setModalAcademicYear,
    components, addComponent, removeComponent, updateComponent,
    totalWeight, isValid, canSave, hasDuplicateKeys,
    formulaPreview,
    modalSaving, handleSave, handleDelete,
    SEMESTERS, ACADEMIC_YEARS,
  } = useAssessmentConfig();

  const onSave = async () => {
    const ok = await handleSave();
    if (ok) {
      toast.success(editingConfig ? "Konfigurasi berhasil diubah" : "Konfigurasi berhasil dibuat");
    } else {
      toast.error("Gagal menyimpan konfigurasi");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Hapus konfigurasi ini?")) return;
    const ok = await handleDelete(id);
    if (ok) {
      toast.success("Konfigurasi berhasil dihapus");
    } else {
      toast.error("Gagal menghapus konfigurasi");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={Scale} title="Konfigurasi Nilai" description="Atur komponen dan bobot penilaian" />

      {/* Filter */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-full sm:w-48">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Filter Kelas</label>
            <Select value={grade || "all"} onValueChange={(v) => setGrade(v === "all" ? "" : (v ?? ""))}>
              <SelectTrigger><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Buat Konfigurasi
          </button>
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
      ) : loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      ) : configs.length === 0 ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <Scale size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Konfigurasi Nilai.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Buat konfigurasi penilaian agar guru dapat menghitung Nilai Akhir Semester.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Buat Konfigurasi
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Kelas</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Semester</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Tahun Ajaran</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Komponen</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((cfg) => {
                  const total = cfg.components.reduce((s, c) => s + c.weight, 0);
                  return (
                    <tr key={cfg._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Kelas {cfg.grade}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Semester {cfg.semester}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cfg.academicYear}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {cfg.components.map((comp) => (
                            <span key={comp.key} className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                              {comp.name} ({comp.weight}%)
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          total === 100
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}>
                          {total === 100 ? "Valid" : "Invalid"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cfg)}
                            className="px-3 py-1.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 rounded-lg transition-colors cursor-pointer"
                          >
                            Ubah
                          </button>
                          <button
                            onClick={() => onDelete(cfg._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {editingConfig ? "Ubah Konfigurasi Nilai" : "Buat Konfigurasi Nilai"}
              </h2>
              <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Grade, Semester, TA */}
              {!editingConfig && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Kelas</label>
                    <Select value={modalGrade} onValueChange={(v) => v && setModalGrade(v)}>
                      <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => (
                          <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Semester</label>
                    <Select value={modalSemester} onValueChange={(v) => v && setModalSemester(v)}>
                      <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SEMESTERS.map((s) => (
                          <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tahun Ajaran</label>
                    <Select value={modalAcademicYear} onValueChange={(v) => v && setModalAcademicYear(v)}>
                      <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ACADEMIC_YEARS.map((y) => (
                          <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {editingConfig && (
                <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 py-3">
                  Kelas {editingConfig.grade} — Semester {editingConfig.semester} — {editingConfig.academicYear}
                </div>
              )}

              {/* Component rows */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Komponen Penilaian</label>
                <div className="space-y-2">
                  {components.map((comp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Kode"
                        value={comp.key}
                        onChange={(e) => updateComponent(index, "key", e.target.value)}
                        className="w-24 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Nama Komponen"
                        value={comp.name}
                        onChange={(e) => updateComponent(index, "name", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="number"
                        placeholder="Bobot"
                        value={comp.weight}
                        onChange={(e) => updateComponent(index, "weight", Number(e.target.value))}
                        className="w-20 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-400 w-4">%</span>
                      <button
                        onClick={() => removeComponent(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addComponent}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  Tambah Komponen
                </button>
              </div>

              {/* Total weight indicator */}
              <div className={`flex items-center gap-2 text-sm font-semibold ${
                totalWeight === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
              }`}>
                Total Bobot: {totalWeight}%
                {totalWeight === 100 ? " ✅" : " ❌"}
              </div>

              {/* Duplicate key warning */}
              {hasDuplicateKeys && (
                <div className="text-xs text-red-500 dark:text-red-400">
                  Kode komponen harus unik.
                </div>
              )}

              {/* Reserved key warning */}
              {!components.some((c) => c.key === "harian") && (
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  Komponen dengan kode &quot;harian&quot; wajib ada.
                </div>
              )}

              {/* Formula preview */}
              {formulaPreview && (
                <div className="bg-slate-50 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Pratinjau Rumus</label>
                  <pre className="text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                    Nilai Akhir ={formulaPreview ? `\n  ${formulaPreview}` : ""}
                  </pre>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    *Komponen dengan nilai 0 akan diabaikan.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={onSave}
                disabled={!canSave || modalSaving}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                {modalSaving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {modalSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
