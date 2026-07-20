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
import EmptyState from "@/components/shared/EmptyState";
import TableSkeleton from "@/components/tables/TableSkeleton";
import Pagination from "@/components/common/Pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants";

const Modal = dynamic(() => import("@/components/modals/Modal"), { ssr: false });

export default function DataMuridPage() {
  const { role, grade: authGrade, isLoading: authLoading } = useAuth();
  const [grade, setGrade] = useState("1");
  const [students, setStudents] = useState<MasterStudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      setStudents(response.result || response.data || []);
      setCurrentPage(1);
    } catch (e: any) {
      setError(e.message || "Gagal mengambil data murid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "guru" && authGrade) {
      setGrade(authGrade);
    }
  }, [role, authGrade]);

  useEffect(() => {
    if (authLoading) return;
    if (role === "guru" && authGrade && grade !== authGrade) return; // Prevent race condition
    fetchStudents();
  }, [grade, authLoading, role, authGrade]);

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

  if (authLoading) return null;

  if (role !== "admin" && role !== "kepala_sekolah" && role !== "guru") {
    return <div className="p-6 text-center text-red-500">Akses ditolak.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={Users} title="Master Data Murid" description="Kelola data murid (Tambah, Ubah, Hapus)" />

      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-2">Pilih Kelas</label>
          <Select value={grade} onValueChange={(val) => val && setGrade(val)} disabled={role === "guru"}>
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

      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
        {loading ? (
          <TableSkeleton headers={["NIS/ID", "Nama", "L/P", "Aksi"]} rows={5} />
        ) : error ? (
          <div className="p-6 text-center text-red-500 flex items-center justify-center gap-2 bg-white/70 dark:bg-gray-800/40 rounded-2xl border border-red-100"><AlertCircle /> {error}</div>
        ) : students.length === 0 ? (
          <EmptyState icon={Users} title="Tidak ada murid di kelas ini" />
        ) : (
          <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30 shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                  <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">NIS/ID</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Nama</th>
                  <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">L/P</th>
                  <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(student => (
                  <tr key={student._id} className="transition-colors animate-fadeIn hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20">
                    <td className="px-4 py-3 md:px-6 md:py-4 text-center text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{student.studentId}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{student.name}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 text-center text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{student.gender}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 flex justify-center gap-2">
                      <button onClick={() => { setEditMode(true); setFormData(student); setModalOpen(true); }} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(student._id!)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && students.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(students.length / ITEMS_PER_PAGE)}
            onPageChange={(page) => setCurrentPage(page)}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={students.length}
          />
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
