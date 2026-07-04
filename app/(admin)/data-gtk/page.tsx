"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  AlertTriangle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
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
const emptyForm: FormData = {
  username: "",
  password: "",
  fullName: "",
  nip: "",
  grade: "",
  title: "",
  role: "guru",
};

const ROLE_OPTIONS = [
  { value: "guru", label: "Guru" },
  { value: "kepala", label: "Kepala" },
  { value: "penjaga", label: "Penjaga" },
];

function Modal({
  title,
  formData,
  setFormData,
  onSubmit,
  onClose,
  submitting,
  isEdit,
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
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-white/20 dark:border-gray-700/50 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          {!isEdit && (
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Role</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                    grade: e.target.value !== "guru" ? "" : formData.grade,
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:text-slate-100"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Username</label>
            <input
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:text-slate-100"
            />
          </div>
          {!isEdit && (
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:text-slate-100"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Nama Lengkap</label>
            <input
              placeholder="Masukkan nama lengkap"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">NIP</label>
            <input
              placeholder="Masukkan NIP"
              value={formData.nip}
              onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:text-slate-100"
            />
          </div>
          {isGuru && (
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Kelas</label>
              <select
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:text-slate-100"
              >
                <option value="">Pilih Kelas</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Kelas {g}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Gelar</label>
            <input
              placeholder="Contoh: S.Pd"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:text-slate-100"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={
              submitting ||
              (!isEdit &&
                (!formData.username ||
                  !formData.password ||
                  (isGuru && !formData.grade)))
            }
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
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
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm border border-white/20 dark:border-gray-700/50 p-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">
          Konfirmasi Hapus
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(id)}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
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

      try {
        const countRes = await StudentAttendanceService.getStudentCountByGrade();
        const counts: Record<string, number> = countRes.result || countRes.data || {};
        setStudentCounts(counts);
      } catch {
        setStudentCounts({});
      }
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 401) {
        router.replace("/login");
        return;
      }
      toast.error(error.message || "Gagal memuat data guru");
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
    const isGuru = formData.role === "guru";
    const label =
      ROLE_OPTIONS.find((r) => r.value === formData.role)?.label || "User";
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
      toast.success(`${label} berhasil ditambahkan`);
      if (isGuru) {
        await fetchTeachers();
      } else {
        await fetchStaff();
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : `Gagal menambahkan ${label.toLowerCase()}`,
      );
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
      toast.success("Data berhasil diupdate");
      await fetchTeachers();
      await fetchStaff();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengupdate data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      await UserService.delete(id);
      await fetchTeachers();
      await fetchStaff();
      toast.success("Data berhasil dihapus");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus data");
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

  if (authLoading || (authRole !== "admin" && authRole !== "kepala"))
    return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative p-5 md:p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/15 rounded-xl flex items-center justify-center animate-iconBounce">
              <Users size={26} className="md:size-[30px] text-white" />
            </div>
            <div>
              <h1 className="text-white text-sm md:text-xl font-bold">
                Data Guru & Tenaga Kependidikan
              </h1>
              <p className="text-indigo-200/80 text-xs md:text-sm mt-0.5">
                Kelola data guru dan tenaga kependidikan
              </p>
            </div>
          </div>
          {userRole !== "kepala" && (
            <button
              onClick={() => {
                setFormData(emptyForm);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-2.5 md:px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shrink-0 backdrop-blur-sm"
            >
              <Plus size={18} />{" "}
              <span className="hidden md:inline">Tambah</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
        {loading ? (
          <div
            key="skeleton"
            className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
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
                      className="px-3 py-3 text-left font-semibold whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: userRole !== "kepala" ? 7 : 6 }).map(
                      (_, j) => (
                        <td key={j} className="px-3 py-3 md:px-6 md:py-4">
                          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : teachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white/80 md:bg-white/60 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Belum ada data guru
            </p>
          </div>
        ) : (
          <div
            key="data"
            className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Username
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Nama Lengkap
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    NIP
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Kelas
                  </th>
                  <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                    Jumlah Murid
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Gelar
                  </th>
                  {userRole !== "kepala" && (
                    <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {teachers.map((guru) => (
                  <tr
                    key={guru._id}
                    className={`transition-colors animate-fadeIn ${deletingId === guru._id ? "opacity-50 pointer-events-none" : "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"}`}
                  >
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {guru.username}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {guru.fullName || "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {guru.nip || "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                      {guru.grade ? `${guru.grade}` : "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-center text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {guru.grade
                        ? `${studentCounts[guru.grade] ?? "-"} Murid`
                        : "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {guru.title || "-"}
                    </td>
                    {userRole !== "kepala" && (
                      <td className="px-3 py-3 md:px-6 md:py-4 text-center">
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

      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
        {staffLoading ? (
          <div
            key="skeleton"
            className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Username
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Nama Lengkap
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    NIP
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Gelar
                  </th>
                  <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                    Jabatan
                  </th>
                  {userRole !== "kepala" && (
                    <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: userRole !== "kepala" ? 6 : 5 }).map(
                      (_, j) => (
                        <td key={j} className="px-3 py-3 md:px-6 md:py-4">
                          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white/80 md:bg-white/60 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Belum ada data tenaga kependidikan
            </p>
          </div>
        ) : (
          <div
            key="data"
            className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Username
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Nama Lengkap
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    NIP
                  </th>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                    Gelar
                  </th>
                  <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                    Jabatan
                  </th>
                  {userRole !== "kepala" && (
                    <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {staff.map((user) => {
                  const roleLabel =
                    ROLE_OPTIONS.find((r) => r.value === user.role)?.label ||
                    user.role;
                  const roleBadgeColor =
                    user.role === "kepala"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
                  return (
                    <tr
                      key={user._id}
                      className={`transition-colors animate-fadeIn ${deletingId === user._id ? "opacity-50 pointer-events-none" : "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"}`}
                    >
                      <td className="px-3 py-3 md:px-6 md:py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {user.username}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {user.fullName || "-"}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {user.nip || "-"}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {user.title || "-"}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${roleBadgeColor}`}
                        >
                          {roleLabel}
                        </span>
                      </td>
                      {userRole !== "kepala" && (
                        <td className="px-3 py-3 md:px-6 md:py-4 text-center">
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
