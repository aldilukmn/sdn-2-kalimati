"use client";

import { GRADES } from "@/lib/constants";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/modals/Modal"), { ssr: false });
import { Loader2 } from "lucide-react";

export interface FormData {
  username: string;
  password: string;
  fullName: string;
  nip: string;
  grade: string;
  title: string;
  role: string;
}

export const emptyForm: FormData = {
  username: "",
  password: "",
  fullName: "",
  nip: "",
  grade: "",
  title: "",
  role: "guru",
};

export const ROLE_OPTIONS = [
  { value: "guru", label: "Guru" },
  { value: "kepala", label: "Kepala" },
  { value: "penjaga", label: "Penjaga" },
];

export default function AddEditModal({
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
    <Modal open onClose={onClose} title={title} className="max-w-md">
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
    </Modal>
  );
}
