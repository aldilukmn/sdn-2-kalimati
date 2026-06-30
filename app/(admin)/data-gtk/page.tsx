"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
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
  role: string;
}

const GRADES = ["1", "2", "3", "4", "5", "6"];
const emptyForm: FormData = { username: "", password: "", fullName: "", nip: "", grade: "", title: "", role: "guru" };

const ROLE_OPTIONS = [
  { value: "guru", label: "Guru" },
  { value: "kepala", label: "Kepala" },
  { value: "penjaga", label: "Penjaga" },
];

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
  const isGuru = formData.role === "guru";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
        <div className="space-y-3">
          {!isEdit && (
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value, grade: e.target.value !== "guru" ? "" : formData.grade })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800">
              {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          )}
          <input placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
          {!isEdit && (
            <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
          )}
          <input placeholder="Nama Lengkap" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
          <input placeholder="NIP" value={formData.nip} onChange={(e) => setFormData({ ...formData, nip: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
          {isGuru && (
            <select value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800">
              <option value="">Pilih Kelas</option>
              {GRADES.map((g) => <option key={g} value={g}>Kelas {g}</option>)}
            </select>
          )}
          <input placeholder="Gelar (contoh: S.Pd)" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:text-gray-200 text-gray-800" />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Batal</button>
          <button onClick={onSubmit} disabled={submitting || (!isEdit && (!formData.username || !formData.password || (isGuru && !formData.grade)))} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Simpan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({
  id,
  onConfirm,
  onClose,
  submitting,
}: {
  id: string | null;
  onConfirm: (id: string) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  if (!id) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Konfirmasi Hapus</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            Batal
          </button>
          <button onClick={() => onConfirm(id)} disabled={submitting} className="flex items-center gap-2 px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DataGTK() {
  const router = useRouter();
  const { userRole: authRole, isLoading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [staff, setStaff] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch {}
    }
  }, []);

  // Route guard: hanya admin/kepala yang boleh akses
  useEffect(() => {
    if (!authLoading && authRole !== "admin" && authRole !== "kepala") {
      router.replace("/dashboard");
    }
  }, [authRole, authLoading]);

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

  const fetchStaff = async () => {
    try {
      const [resKepala, resPenjaga] = await Promise.all([
        UserService.getStaffByRoles("kepala"),
        UserService.getStaffByRoles("penjaga"),
      ]);
      const kepala = resKepala.result || resKepala.data || [];
      const penjaga = resPenjaga.result || resPenjaga.data || [];
      setStaff([...kepala, ...penjaga]);
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 401) {
        router.replace("/login");
        return;
      }
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || (authRole !== "admin" && authRole !== "kepala")) return;
    fetchTeachers();
    fetchStaff();
  }, [authRole, authLoading]);

  const handleAdd = async () => {
    setSubmitting(true);
    setError(null);
    const isGuru = formData.role === "guru";
    const label = ROLE_OPTIONS.find(r => r.value === formData.role)?.label || "User";
    try {
      await UserService.create({
        username: formData.username,
        password: formData.password,
        role: formData.role,
        grade: isGuru ? formData.grade : undefined,
        nip: formData.nip || undefined,
        fullName: formData.fullName || undefined,
        title: formData.title || undefined,
      });
      setShowAddModal(false);
      setFormData(emptyForm);
      setSuccess(`${label} berhasil ditambahkan`);
      setTimeout(() => setSuccess(null), 3000);
      if (isGuru) {
        await fetchTeachers();
      } else {
        await fetchStaff();
      }
    } catch (err) {
      setSuccess(null);
      setError(err instanceof Error ? err.message : `Gagal menambahkan ${label.toLowerCase()}`);
    } finally {
      setSubmitting(false);
    }
  };

  const refreshTable = async (role: string) => {
    if (role === "guru") {
      await fetchTeachers();
    } else {
      await fetchStaff();
    }
  };

  const handleEdit = async () => {
    if (!editId) return;
    setSubmitting(true);
    setError(null);
    try {
      await UserService.update(editId, {
        username: formData.username,
        grade: formData.grade || undefined,
        nip: formData.nip || undefined,
        fullName: formData.fullName || undefined,
        title: formData.title || undefined,
      });
      setShowEditModal(false);
      setEditId(null);
      setFormData(emptyForm);
      setSuccess("Data berhasil diupdate");
      setTimeout(() => setSuccess(null), 3000);
      await fetchTeachers();
      await fetchStaff();
    } catch (err) {
      setSuccess(null);
      setError(err instanceof Error ? err.message : "Gagal mengupdate data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(null);
    setDeletingId(id);
    setError(null);
    try {
      await UserService.delete(id);
      await fetchTeachers();
      await fetchStaff();
      setSuccess("Data berhasil dihapus");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setSuccess(null);
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (user: TeacherType) => {
    setEditId(user._id);
    setFormData({
      username: user.username,
      password: "",
      fullName: user.fullName || "",
      nip: user.nip || "",
      grade: user.grade || "",
      title: user.title || "",
      role: user.role || "guru",
    });
    setShowEditModal(true);
  };

  if (authLoading || (authRole !== "admin" && authRole !== "kepala")) return null;

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
        {userRole !== "kepala" && (
          <button
            onClick={() => {
              setFormData(emptyForm);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={20} /> Tambah User
          </button>
        )}
      </div>

      {success && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-green-400 dark:border-green-600 shadow-xl rounded-xl text-green-700 dark:text-green-200 text-sm font-medium animate-in slide-in-from-top-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-red-400 dark:border-red-600 shadow-xl rounded-xl text-red-600 dark:text-red-300 text-sm font-medium animate-in slide-in-from-top-2">
          <AlertCircle size={18} />
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
                    ...(userRole !== "kepala" ? ["Aksi"] : []),
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
                  {userRole !== "kepala" && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y bg-white divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                {teachers.map((guru) => (
                  <tr
                    key={guru._id}
                    className={`transition-colors ${deletingId === guru._id ? "opacity-50 pointer-events-none" : "hover:bg-teal-50 dark:hover:bg-gray-700/50"}`}
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
                    {userRole !== "kepala" && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(guru)}
                            disabled={deletingId === guru._id}
                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors dark:text-indigo-400 dark:hover:bg-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(guru._id)}
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
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
          Data Tenaga Kependidikan
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Kepala sekolah, penjaga, dan tenaga non-guru lainnya
        </p>
      </div>

      <div className="rounded-lg shadow overflow-hidden">
        {staffLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Lengkap</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">NIP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Gelar</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Jabatan</th>
                  {userRole !== "kepala" && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y bg-white divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: userRole !== "kepala" ? 6 : 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : staff.length === 0 ? (
          <div className="border border-indigo-500/40 bg-indigo-500/5 px-5 py-6 rounded-xl text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada data tenaga kependidikan
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Lengkap</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">NIP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Gelar</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Jabatan</th>
                  {userRole !== "kepala" && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y bg-white divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                {staff.map((user) => {
                  const roleLabel = ROLE_OPTIONS.find(r => r.value === user.role)?.label || user.role;
                  const roleBadgeColor =
                    user.role === "kepala"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
                  return (
                    <tr
                      key={user._id}
                      className={`transition-colors ${deletingId === user._id ? "opacity-50 pointer-events-none" : "hover:bg-indigo-50 dark:hover:bg-gray-700/50"}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.fullName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.nip || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.title || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${roleBadgeColor}`}>
                          {roleLabel}
                        </span>
                      </td>
                      {userRole !== "kepala" && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(user)}
                              disabled={deletingId === user._id}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors dark:text-indigo-400 dark:hover:bg-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(user._id)}
                              disabled={deletingId === user._id}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50 cursor-pointer"
                              title="Hapus"
                            >
                              {deletingId === user._id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <Modal
          title="Tambah User Baru"
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

      <ConfirmDialog
        id={confirmDeleteId}
        onConfirm={handleDelete}
        onClose={() => setConfirmDeleteId(null)}
        submitting={deletingId !== null}
      />
    </div>
  );
}
