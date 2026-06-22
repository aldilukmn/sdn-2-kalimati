"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX,
  Clock,
  FileText,
} from "lucide-react";
import { Card } from "flowbite-react";
import BackButton from "../components/BackButton";
import { getSiswaByKelas, daftarKelas } from "../data/siswa";
import PresensiService from "@/services/presensi.service";
import AuthService from "@/services/auth.service";

const STATUS_LABEL: Record<string, string> = {
  hadir: "Hadir",
  sakit: "Sakit",
  izin: "Izin",
  alpha: "Alpha",
};

const STATUS_BTN: Record<string, string> = {
  hadir: "bg-green-500 hover:bg-green-600 text-white ring-2 ring-green-300 dark:ring-green-700",
  sakit: "bg-yellow-500 hover:bg-yellow-600 text-white ring-2 ring-yellow-300 dark:ring-yellow-700",
  izin: "bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-700",
  alpha: "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-300 dark:ring-red-700",
};

interface Entry {
  nisn: string;
  nama: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
}

export default function PresensiPage() {
  const router = useRouter();
  const [kelas, setKelas] = useState("1");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isExisting, setIsExisting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const role =
    typeof window !== "undefined"
      ? sessionStorage.getItem("user_role")
      : null;

  useEffect(() => {
    if (role && role !== "guru" && role !== "admin") {
      router.replace("/login");
    }
  }, [role, router]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await AuthService.logout();
    } catch {
      // proceed with local logout regardless
    } finally {
      sessionStorage.removeItem("user_session");
      sessionStorage.removeItem("user_identifier");
      sessionStorage.removeItem("user_role");
      document.cookie = "user_session=; path=/; max-age=0";
      router.replace("/login");
    }
  };

  const loadSiswa = () => {
    const siswaList = getSiswaByKelas(kelas);
    setEntries(
      siswaList.map((s) => ({
        nisn: s.nisn,
        nama: s.nama,
        status: "hadir" as const,
      }))
    );
    setIsExisting(false);
    setMessage(null);
  };

  useEffect(() => {
    loadSiswa();
  }, [kelas]);

  const cekPresensiExisting = async () => {
    if (!tanggal || !kelas) return;
    setFetching(true);
    setMessage(null);
    try {
      const response = await PresensiService.getByClass(kelas, tanggal);
      const data = response.result || response.data || [];
      if (data.length > 0) {
        const siswaList = getSiswaByKelas(kelas);
        const merged = siswaList.map((s) => {
          const existing = data.find(
            (e: any) => e.nisn === s.nisn
          );
          return {
            nisn: s.nisn,
            nama: s.nama,
            status: existing?.status || "hadir" as const,
          };
        });
        setEntries(merged);
        setIsExisting(true);
        setMessage({
          type: "success",
          text: "Data presensi sudah ada. Silakan edit jika perlu.",
        });
      } else {
        if (!isExisting) loadSiswa();
        setIsExisting(false);
      }
    } catch {
      if (!isExisting) loadSiswa();
      setIsExisting(false);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (kelas && tanggal) {
      cekPresensiExisting();
    }
  }, [tanggal]);

  const handleStatusChange = (nisn: string, status: Entry["status"]) => {
    setEntries((prev) =>
      prev.map((e) => (e.nisn === nisn ? { ...e, status } : e))
    );
  };

  const handleSave = async () => {
    if (!tanggal || !kelas || entries.length === 0) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload: PresensiHarian = {
        tanggal,
        kelas,
        entries: entries.map((e) => ({
          nisn: e.nisn,
          nama: e.nama,
          status: e.status,
        })),
      };
      await PresensiService.create(payload);
      setMessage({
        type: "success",
        text: isExisting
          ? "Data presensi berhasil diperbarui!"
          : "Data presensi berhasil disimpan!",
      });
      setIsExisting(true);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Gagal menyimpan data presensi",
      });
    } finally {
      setSaving(false);
    }
  };

  const countByStatus = (status: string) =>
    entries.filter((e) => e.status === status).length;

  return (
    <div className="flex flex-col items-center justify-start gap-6 px-4 py-7 xl:py-10 min-h-screen">
      <div className="flex items-center justify-between w-full max-w-4xl">
        <BackButton />
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {logoutLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
          <span>{logoutLoading ? "Logout..." : "Logout"}</span>
        </button>
      </div>

      <Card className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <div className="text-4xl md:text-5xl mb-3">📋</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Presensi Siswa Harian
          </h1>
          <p className="text-sm opacity-70 text-gray-600 dark:text-gray-300 mt-1">
            Input kehadiran siswa per kelas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kelas
            </label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            >
              {daftarKelas.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tanggal
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            />
          </div>
        </div>

        {fetching && (
          <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Memuat data presensi...</span>
          </div>
        )}

        {!fetching && (
          <>
            {message && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {message.text}
              </div>
            )}

            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Tidak ada siswa di kelas ini
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    <UserCheck size={14} /> Hadir: {countByStatus("hadir")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <Clock size={14} /> Sakit: {countByStatus("sakit")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <FileText size={14} /> Izin: {countByStatus("izin")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    <UserX size={14} /> Alpha: {countByStatus("alpha")}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-gray-800">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 w-12">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                          Nama Siswa
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                          NISN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                          Status Kehadiran
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                      {entries.map((entry, i) => (
                        <tr
                          key={entry.nisn}
                          className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {entry.nama}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 text-center">
                            {entry.nisn}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              {(["hadir", "sakit", "izin", "alpha"] as const).map(
                                (status) => (
                                  <button
                                    key={status}
                                    onClick={() =>
                                      handleStatusChange(entry.nisn, status)
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                      entry.status === status
                                        ? STATUS_BTN[status]
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                    }`}
                                  >
                                    {STATUS_LABEL[status]}
                                  </button>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving || entries.length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {saving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {saving
                      ? "Menyimpan..."
                      : isExisting
                        ? "Perbarui Presensi"
                        : "Simpan Presensi"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
