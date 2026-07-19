"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Pencil, Trash2, Upload, AlertCircle } from "lucide-react";
import { MasterStudentService } from "@/services/master-student.service";
import { MasterStudentType } from "@/types/attendance";
import { GRADES } from "@/lib/constants";
import PageHero from "@/components/layout/PageHero";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

const Modal = dynamic(() => import("@/components/modals/Modal"), { ssr: false });

export default function DataMuridPage() {
  const { role } = useAuth();
  const [grade, setGrade] = useState("1");
  const [students, setStudents] = useState<MasterStudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<MasterStudentType>>({
    studentId: "", name: "", grade: "1", gender: "L", nisn: ""
  });
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await MasterStudentService.getByGrade(grade);
      setStudents(response.data || []);
    } catch (e: any) {
      setError(e.message || "Gagal mengambil data murid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [grade]);

  const handleSave = async () => {
    try {
      if (!formData.studentId || !formData.name || !formData.grade || !formData.gender) {
        toast.error("Harap isi kolom wajib (ID, Nama, Kelas, L/P)");
        return;
      }
      setSaving(true);
      if (editMode && formData._id) {
        await MasterStudentService.update(formData._id, formData);
        toast.success("Data murid berhasil diubah");
      } else {
        await MasterStudentService.create(formData);
        toast.success("Data murid berhasil ditambahkan");
      }
      setModalOpen(false);
      fetchStudents();
    } catch (e: any) {
      toast.error(e.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus murid ini?")) return;
    try {
      await MasterStudentService.remove(id);
      toast.success("Murid berhasil dihapus");
      fetchStudents();
    } catch (e: any) {
      toast.error(e.message || "Gagal menghapus murid");
    }
  };

  if (role !== "admin" && role !== "kepala_sekolah") {
    return <div className="p-6 text-center text-red-500">Akses ditolak. Hanya Admin / Kepala Sekolah yang bisa mengelola data murid.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={Users} title="Master Data Murid" description="Kelola data murid (Tambah, Ubah, Hapus)" />

      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-2">Pilih Kelas</label>
          <Select value={grade} onValueChange={(val) => val && setGrade(val)}>
            <SelectTrigger className="w-full h-auto rounded-xl bg-slate-50 border-slate-300 dark:bg-gray-950 dark:border-gray-700 px-4 py-2.5 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kelas</SelectLabel>
                {GRADES.map(g => <SelectItem key={g} value={g}>Kelas {g}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={() => { setEditMode(false); setFormData({ studentId: "", name: "", grade, gender: "L", nisn: "" }); setModalOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all"
        >
          <Plus size={16} /> Tambah Murid
        </button>
      </div>

      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-500">Memuat data...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500 flex items-center justify-center gap-2"><AlertCircle /> {error}</div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-slate-500">Tidak ada murid di kelas ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4">NIS/ID</th>
                  <th className="px-6 py-4">Nama Murid</th>
                  <th className="px-6 py-4">L/P</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {students.map(student => (
                  <tr key={student._id} className="bg-white dark:bg-transparent">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.studentId}</td>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.gender}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button onClick={() => { setEditMode(true); setFormData(student); setModalOpen(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(student._id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? "Ubah Data Murid" : "Tambah Murid Baru"} className="max-w-md">
        <div className="space-y-4">
          <div><label className="block text-sm mb-1">ID/NIS</label><input type="text" value={formData.studentId || ""} onChange={e => setFormData({ ...formData, studentId: e.target.value })} className="w-full border p-2 rounded-xl" /></div>
          <div><label className="block text-sm mb-1">Nama Lengkap</label><input type="text" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Kelas</label>
              <select value={formData.grade || "1"} onChange={e => setFormData({ ...formData, grade: e.target.value })} className="w-full border p-2 rounded-xl">
                {GRADES.map(g => <option key={g} value={g}>Kelas {g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Jenis Kelamin</label>
              <select value={formData.gender || "L"} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full border p-2 rounded-xl">
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full bg-indigo-600 text-white p-2 rounded-xl">{saving ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </Modal>
    </div>
  );
}
