"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import PageHero from "@/app/components/PageHero";
import { UserCircle, Camera, Save, X, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  guru: "Guru Kelas",
  kepala: "Kepala Sekolah",
  penjaga: "Penjaga",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-indigo-500",
  guru: "bg-emerald-500",
  kepala: "bg-purple-500",
  penjaga: "bg-amber-500",
};

interface Props {
  userId?: string;
}

export default function ProfileView({ userId }: Props) {
  const { role: userRole } = useAuth();
  const { profile, loading, saving, isSelf, updateProfile } = useProfile(userId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({ fullName: "", title: "", nip: "", username: "" });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 animate-fadeIn">
        <PageHero icon={UserCircle} title="Profil" description="Memuat..." />
        <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 animate-fadeIn">
        <PageHero icon={UserCircle} title="Profil" description="Pengguna tidak ditemukan" />
      </div>
    );
  }

  const avatarUrl = previewUrl || profile.image_url;
  const initials = (profile.fullName || profile.username || "?").charAt(0).toUpperCase();
  const roleColor = ROLE_COLORS[profile.role] || "bg-slate-400";
  const canEdit = isSelf && userRole === profile.role;

  const handleEditClick = () => {
    setForm({
      fullName: profile.fullName,
      title: profile.title,
      nip: profile.nip,
      username: profile.username,
    });
    setEditMode(true);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setNewPassword("");
    setConfirmPassword("");
    setOldPassword("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      toast.error("Format gambar harus jpeg, png, gif, atau webp");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const fd = new FormData();
    if (profile.role !== "admin") {
      fd.append("fullName", form.fullName);
      fd.append("title", form.title);
      fd.append("nip", form.nip);
    }
    if (form.username !== profile.username) {
      fd.append("username", form.username);
    }
    if (selectedFile) {
      fd.append("photo", selectedFile);
    }
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("Konfirmasi password tidak cocok");
        return;
      }
      if (newPassword.length < 8) {
        toast.error("Password baru minimal 8 karakter");
        return;
      }
      if (!oldPassword) {
        toast.error("Password lama wajib diisi");
        return;
      }
      fd.append("oldPassword", oldPassword);
      fd.append("newPassword", newPassword);
    }
    await updateProfile(fd);
    setEditMode(false);
    setNewPassword("");
    setConfirmPassword("");
    setOldPassword("");
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-fadeIn">
      <PageHero
        icon={UserCircle}
        title="Profil"
        description={userId ? `Detail pengguna` : "Kelola profil saya"}
      >
        {userId && (
          <Link
            href={isSelf ? "/profil" : "/data-gtk"}
            className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer backdrop-blur-sm"
          >
            <ArrowLeft size={16} />
            Kembali
          </Link>
        )}
      </PageHero>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-1">
          <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-6 text-center">
            <div className="relative inline-block">
              <div
                className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden ${roleColor}`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              {editMode && canEdit && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 p-2 bg-white dark:bg-slate-700 rounded-full shadow-md border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="Ganti foto"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-4">
              {profile.role === "admin"
                ? `${profile.username}`
                : `${profile.fullName}${profile.title == "-" ? "" : ", " + profile.title}`
              }
            </h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${roleColor} mt-2`}
            >
              {ROLE_LABELS[profile.role] || profile.role}
            </span>
            {profile.grade && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Kelas {profile.grade}
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-6">
          {/* Data Diri */}
          <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                DATA DIRI
              </h3>
              {!editMode && canEdit && (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-pointer"
                >
                  Edit Profil
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(
                [
                  { label: "Nama Lengkap", key: "fullName", editable: true },
                  { label: "Gelar", key: "title", editable: true },
                  { label: "NIP", key: "nip", editable: true },
                  { label: "Username", key: "username", editable: true },
                  { label: "Role", key: "role", editable: false },
                  ...(profile.grade
                    ? [{ label: "Kelas", key: "grade", editable: false }]
                    : []),
                ] as { label: string; key: string; editable: boolean }[]
              )
                .filter(
                  (field) =>
                    profile.role !== "admin" ||
                    !["fullName", "title", "nip"].includes(field.key),
                )
                .map(({ label, key, editable }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400 w-32 shrink-0">
                    {label}
                  </span>
                  {editMode && editable ? (
                    <input
                      value={
                        (form as unknown as Record<string, string>)[key] || ""
                      }
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-gray-900 outline-none transition duration-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400"
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      {String(
                        (profile as unknown as Record<string, unknown>)[key] ??
                          "-",
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {editMode && (
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/20 dark:border-gray-700/50 w-full">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 cursor-pointer"
                >
                  <X size={16} />
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Simpan
                </button>
              </div>
            )}
          </div>

          {/* Ganti Password */}
          {canEdit && (
            <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-4">
                GANTI PASSWORD
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Password Lama",
                    value: oldPassword,
                    setter: setOldPassword,
                    show: showOld,
                    toggle: () => setShowOld(!showOld),
                  },
                  {
                    label: "Password Baru",
                    value: newPassword,
                    setter: setNewPassword,
                    show: showNew,
                    toggle: () => setShowNew(!showNew),
                  },
                  {
                    label: "Konfirmasi Password",
                    value: confirmPassword,
                    setter: setConfirmPassword,
                    show: showConfirm,
                    toggle: () => setShowConfirm(!showConfirm),
                  },
                ].map(({ label, value, setter, show, toggle }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400 w-36 shrink-0">
                      {label}
                    </span>
                    <div className="relative flex-1">
                      <input
                        type={show ? "text" : "password"}
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder={label}
                        className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 text-sm text-gray-900 outline-none transition duration-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400"
                      />
                      <button
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        type="button"
                      >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    disabled={
                      saving ||
                      (!newPassword && !oldPassword && !confirmPassword)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ml-auto"
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
