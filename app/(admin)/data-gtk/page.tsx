"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import UserService from "@/services/user.service";
import StudentAttendanceService from "@/services/student-attendance.service";

interface FormData {
  username: string;
  password: string;
  fullName: string;
  nip: string;
  grade: string;
  title: string;
}

const GRADES = ["1", "2", "3", "4", "5", "6"];
const emptyForm: FormData = { username: "", password: "", fullName: "", nip: "", grade: "", title: "" };

function Modal({
  title, formData, setFormData, onSubmit, onClose, submitting, isEdit
}: {
  title: string;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitting: boolean;
  isEdit: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
        <div className="space-y-3">
          <input placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
          {!isEdit && (
            <>
              <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
            </>
          )}
          <input placeholder="Nama Lengkap" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
          <input placeholder="NIP" value={formData.nip} onChange={(e) => setFormData({ ...formData, nip: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
          <select value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800">
            <option value="">Pilih Kelas</option>
            {GRADES.map((g) => <option key={g} value={g}>Kelas {g}</option>)}
          </select>
          <input placeholder="Gelar (contoh: S.Pd)" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Batal</button>
          <button onClick={onSubmit} disabled={submitting || (!isEdit && (!formData.username || !formData.password || !formData.grade))} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Simpan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DataGTK() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});

  const fetchTeachers = async () => {
    try {
      const res = await UserService.getTeachers();
      const data = res.result || [];
      data.sort((a: TeacherType, b: TeacherType) =>
        (a.grade || "0").localeCompare(b.grade || "0"),
      );
      setTeachers(res.result || res.data || []);

      const counts: Record<string, number> = {};
      await Promise.all(
        data.map(async (guru) => {
          if (!guru.grade || counts[guru.grade] !== undefined) return;
          try {
            const res = await StudentAttendanceService.getStudentsByGrade(guru.grade);
            const students = res.data || res.result || [];
            counts[guru.grade] = students.length;
          } catch { counts[guru.grade] = 0; }
        })
      );
      setStudentCounts(counts);
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 401) {
        router.replace("/login");
        return;
      }
      setError(error.message || "Gagal memuat data guru");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [router]);

  const handleAdd = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await UserService.create({
        username: formData.username,
        password: formData.password,
        role: "guru",
        grade: formData.grade,
        nip: formData.nip || undefined,
        fullName: formData.fullName || undefined,
        title: formData.title || undefined,
      });
      setShowAddModal(false);
      setFormData(emptyForm);
      setSuccess("Guru berhasil ditambahkan");
      setTimeout(() => setSuccess(null), 3000);
      await fetchTeachers();
    } catch (err) {
      setSuccess(null);
      setError(err instanceof Error ? err.message : "Gagal menambahkan guru");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editId) return;
    setSubmitting(true);
    setError(null);
    try {
      await UserService.update(editId, {
        username: formData.username,
        grade: formData.grade,
        nip: formData.nip || undefined,
        fullName: formData.fullName || undefined,
        title: formData.title || undefined,
      });
      setShowEditModal(false);
      setEditId(null);
      setFormData(emptyForm);
      setSuccess("Guru berhasil diupdate");
      setTimeout(() => setSuccess(null), 3000);
      await fetchTeachers();
    } catch (err) {
      setSuccess(null);
      setError(err instanceof Error ? err.message : "Gagal mengupdate guru");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus guru ini?")) return;
    setDeletingId(id);
    setError(null);
    try {
      await UserService.delete(id);
      setSuccess("Guru berhasil dihapus");
      setTimeout(() => setSuccess(null), 3000);
      await fetchTeachers();
    } catch (err) {
      setSuccess(null);
      setError(err instanceof Error ? err.message : "Gagal menghapus guru");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (teacher: TeacherType) => {
    setEditId(teacher._id);
    setFormData({
      username: teacher.username,
      password: "",
      fullName: teacher.fullName || "",
      nip: teacher.nip || "",
      grade: teacher.grade || "1",
      title: teacher.title || "",
    });
    setShowEditModal(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Data Guru
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola data guru dan tenaga kependidikan
          </p>
        </div>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={20} /> Tambah Guru
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900/30 dark:border-green-700 dark:text-green-200">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-600 text-white">
                  {[
                    "Username",
                    "Nama Lengkap",
                    "NIP",
                    "Kelas",
                    "Jumlah Murid",
                    "Gelar",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y bg-white divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : teachers.length === 0 ? (
          <div className="border border-teal-500/40 bg-teal-500/5 px-5 py-6 rounded-xl text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada data guru
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    NIP
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Kelas
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Jumlah Murid
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Gelar
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                {teachers.map((guru) => (
                  <tr
                    key={guru._id}
                    className="hover:bg-teal-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {guru.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {guru.fullName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {guru.nip || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                      {guru.grade ? `${guru.grade}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                      {guru.grade ? `${studentCounts[guru.grade] ?? "-"} Murid` : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {guru.title || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(guru)}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors dark:text-indigo-400 dark:hover:bg-indigo-900/30 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(guru._id)}
                          disabled={deletingId === guru._id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50 cursor-pointer"
                          title="Hapus"
                        >
                          {deletingId === guru._id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <Modal
          title="Tambah Guru Baru"
          formData={formData}
          setFormData={setFormData}
          submitting={submitting}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
          isEdit={false}
        />
      )}
      {showEditModal && (
        <Modal
          title="Edit Guru"
          formData={formData}
          setFormData={setFormData}
          submitting={submitting}
          onClose={() => {
            setShowEditModal(false);
            setEditId(null);
          }}
          onSubmit={handleEdit}
          isEdit={true}
        />
      )}
    </div>
  );
}
