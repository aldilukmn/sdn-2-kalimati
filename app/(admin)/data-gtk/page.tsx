"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PageHero from "@/app/components/PageHero";
import type { TeacherType } from "@/types/user";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  X,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import UserService from "@/services/user.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import AddEditModal, { FormData, emptyForm, ROLE_OPTIONS } from "./components/AddEditModal";
import ConfirmDialog from "./components/ConfirmDialog";
import TableSkeleton from "@/app/components/TableSkeleton";
import EmptyState from "@/app/components/shared/EmptyState";

export default function DataGTK() {
  const router = useRouter();
  const { role: authRole, isLoading: authLoading } = useAuth();
  const userRole = authRole;
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
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  const [savingsHolderLoading, setSavingsHolderLoading] = useState<string | null>(null);

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
      const resKepalaPenjaga = await UserService.getStaffByRoles("kepala,penjaga");
      const allStaff = resKepalaPenjaga.result || resKepalaPenjaga.data || [];
      setStaff(allStaff);
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
    if (authLoading) return;
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

  const handleSavingsHolderToggle = async (user: TeacherType) => {
    const newValue = !user.savingsHolder;
    setSavingsHolderLoading(user._id);
    try {
      await UserService.setSavingsHolder(user._id, newValue);
      setTeachers((prev) =>
        prev.map((t) =>
          t._id === user._id ? { ...t, savingsHolder: newValue } : t,
        ),
      );
      toast.success(
        `Pengelola Tabungan ${newValue ? "ditugaskan" : "dicabut"} untuk ${user.fullName || user.username}`,
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengubah status Pengelola Tabungan",
      );
    } finally {
      setSavingsHolderLoading(null);
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

  if (authLoading) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHero
        icon={Users}
        title="Data Guru & Tenaga Kependidikan"
        description="Kelola data guru dan tenaga kependidikan"
      >
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
      </PageHero>

      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
        {loading ? (
          <TableSkeleton
            headers={[
              "Username", "Nama Lengkap", "NIP", "Kelas", "Jumlah Murid",
              "Pengelola Tabungan", "Gelar",
              ...(userRole !== "kepala" ? ["Aksi"] : []),
            ]}
            rows={5}
          />
        ) : teachers.length === 0 ? (
          <EmptyState icon={Users} title="Belum ada data guru" />
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
                  <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                    Pengelola Tabungan
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
                    <td className="px-3 py-3 md:px-6 md:py-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleSavingsHolderToggle(guru)}
                        disabled={savingsHolderLoading === guru._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          guru.savingsHolder
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                            : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-700"
                        }`}
                        title={guru.savingsHolder ? "Klik untuk cabut" : "Klik untuk tugaskan"}
                      >
                        {savingsHolderLoading === guru._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : guru.savingsHolder ? (
                          <Check size={14} />
                        ) : (
                          <X size={14} />
                        )}
                        {guru.savingsHolder ? "Ya" : "Tidak"}
                      </button>
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
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
          <TableSkeleton
            headers={[
              "Username", "Nama Lengkap", "NIP", "Gelar", "Jabatan",
              ...(userRole !== "kepala" ? ["Aksi"] : []),
            ]}
            rows={3}
          />
        ) : staff.length === 0 ? (
          <EmptyState icon={Users} title="Belum ada data tenaga kependidikan" />
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
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        <AddEditModal
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
        <AddEditModal
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
