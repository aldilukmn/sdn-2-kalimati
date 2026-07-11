"use client";

import { useState, useEffect, useCallback } from "react";
import { ListChecks, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import CharacterHabitService from "@/services/character-habit.service";
import type { CharacterHabit } from "@/types/character-habit";
import { useAuth } from "@/app/contexts/AuthContext";
import PageHero from "@/app/components/PageHero";
import Modal from "@/app/components/Modal";
import TableSkeleton from "@/app/components/TableSkeleton";
import InputField from "@/app/components/form/InputField";

export default function KarakterHabitsPage() {
  const { userRole } = useAuth();
  const isWriteAllowed = userRole === "admin" || userRole === "kepala";

  const [habits, setHabits] = useState<CharacterHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createOrder, setCreateOrder] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editOrder, setEditOrder] = useState("");

  // Delete confirm
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CharacterHabitService.getAll();
      setHabits(res.result || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal memuat data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const openCreate = () => {
    setCreateName("");
    setCreateOrder("");
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    if (!createName.trim()) {
      toast.error("Nama kebiasaan wajib diisi");
      return;
    }
    const orderNum = parseInt(createOrder, 10);
    if (isNaN(orderNum)) {
      toast.error("Urutan wajib diisi");
      return;
    }
    setSaving(true);
    try {
      await CharacterHabitService.create({ name: createName.trim(), order: orderNum });
      toast.success("Kebiasaan berhasil ditambahkan");
      setCreateOpen(false);
      fetchHabits();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal menyimpan";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (habit: CharacterHabit) => {
    setEditId(habit._id);
    setEditName(habit.name);
    setEditOrder(String(habit.order));
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId) return;
    if (!editName.trim()) {
      toast.error("Nama kebiasaan wajib diisi");
      return;
    }
    const orderNum = parseInt(editOrder, 10);
    if (isNaN(orderNum)) {
      toast.error("Urutan wajib diisi");
      return;
    }
    setSaving(true);
    try {
      await CharacterHabitService.update(editId, { name: editName.trim(), order: orderNum });
      toast.success("Kebiasaan berhasil diperbarui");
      setEditOpen(false);
      setEditId(null);
      fetchHabits();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal menyimpan";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (habit: CharacterHabit) => {
    setDeleteId(habit._id);
    setDeleteName(habit.name);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await CharacterHabitService.remove(deleteId);
      toast.success("Kebiasaan berhasil dihapus");
      setDeleteOpen(false);
      setDeleteId(null);
      setDeleteName("");
      fetchHabits();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal menghapus";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ListChecks} title="Kebiasaan Anak Indonesia Hebat" description="Kelola daftar kebiasaan yang digunakan dalam penilaian karakter" />

      {/* Header actions */}
      {isWriteAllowed && (
        <div className="flex justify-end">
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Plus size={16} />
            Tambah Kebiasaan
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle size={40} className="mx-auto text-red-300 dark:text-red-600 mb-3" />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button
              onClick={fetchHabits}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
          <TableSkeleton headers={["No", "Nama Kebiasaan", "Urutan", ...(isWriteAllowed ? ["Aksi"] : [])]} rows={5} />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && habits.length === 0 && (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <ListChecks size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada kebiasaan.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              {isWriteAllowed ? "Klik tombol Tambah Kebiasaan untuk menambahkan." : "Hubungi Admin untuk menambahkan kebiasaan."}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && habits.length > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="text-center px-4 py-3 font-semibold w-12 whitespace-nowrap">No</th>
                  <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Nama Kebiasaan</th>
                  <th className="text-center px-4 py-3 font-semibold w-20 whitespace-nowrap">Urutan</th>
                  {isWriteAllowed && <th className="text-center px-4 py-3 font-semibold w-28 whitespace-nowrap">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {habits
                  .sort((a, b) => a.order - b.order)
                  .map((habit, i) => (
                    <tr key={habit._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                      <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{i + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">{habit.name}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">{habit.order}</td>
                      {isWriteAllowed && (
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEdit(habit)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => openDelete(habit)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Tambah Kebiasaan" className="max-w-md">
        <div className="flex flex-col gap-4">
          <InputField label="Nama Kebiasaan" name="createName" value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Contoh: Bangun Pagi" />
          <InputField label="Urutan" name="createOrder" value={createOrder} onChange={(e) => setCreateOrder(e.target.value)} placeholder="Contoh: 1" numericOnly />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setCreateOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : "Simpan"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Kebiasaan" className="max-w-md">
        <div className="flex flex-col gap-4">
          <InputField label="Nama Kebiasaan" name="editName" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Contoh: Bangun Pagi" />
          <InputField label="Urutan" name="editOrder" value={editOrder} onChange={(e) => setEditOrder(e.target.value)} placeholder="Contoh: 1" numericOnly />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setEditOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleEdit}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : "Simpan"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Hapus Kebiasaan" className="max-w-sm">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          Yakin ingin menghapus kebiasaan <strong>{deleteName}</strong>?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setDeleteOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {deleting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menghapus...
              </span>
            ) : "Hapus"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
