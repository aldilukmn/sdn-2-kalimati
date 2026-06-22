"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Download,
  UserCheck,
  UserX,
  Clock,
  FileText,
  CalendarDays,
} from "lucide-react";
import { Card } from "flowbite-react";
import PresensiService from "@/services/presensi.service";
import { getSiswaByKelas, daftarKelas } from "@/app/data/siswa";
import { exportPresensiToCSV } from "@/lib/export-presensi-csv";
import BackButton from "../components/BackButton";

export default function RekapPresensi() {
  const [kelas, setKelas] = useState("1");
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [dataPresensi, setDataPresensi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const siswaList = getSiswaByKelas(kelas);

  const fetchAllPresensi = async () => {
    try {
      const allData = [];
      for (const siswa of siswaList) {
        try {
          const response = await PresensiService.getRekapByNisn(
            siswa.nisn,
            bulan,
            tahun
          );
          const data = response.result || response.data || [];
          for (const d of data) {
            allData.push({
              ...d,
              nama: siswa.nama,
              nisn: siswa.nisn,
              kelas: siswa.kelas,
            });
          }
        } catch {
          // skip siswa without data
        }
      }
      setDataPresensi(allData);
    } catch {
      setError("Gagal memuat data presensi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAllPresensi();
  }, [kelas, bulan, tahun]);

  const handleExport = () => {
    const rows = dataPresensi.map((d) => ({
      nisn: d.nisn,
      nama: d.nama,
      kelas: d.kelas,
      tanggal: d.tanggal,
      status: d.status,
    }));
    exportPresensiToCSV(rows, `kelas-${kelas}-bulan-${bulan}`);
  };

  const countByStatus = (status: string) =>
    dataPresensi.filter((d) => d.status === status).length;

  const totalHari = dataPresensi.length;

  const getStudentStats = (nisn: string) => {
    const studentData = dataPresensi.filter((d) => d.nisn === nisn);
    return {
      total: studentData.length,
      hadir: studentData.filter((d) => d.status === "hadir").length,
      sakit: studentData.filter((d) => d.status === "sakit").length,
      izin: studentData.filter((d) => d.status === "izin").length,
      alpha: studentData.filter((d) => d.status === "alpha").length,
    };
  };

  return (
    <div className="flex flex-col items-center justify-start gap-6 px-4 py-7 xl:py-10 min-h-screen">
      <BackButton />

      <Card className="w-full max-w-6xl">
        <div className="text-center mb-6">
          <div className="text-4xl md:text-5xl mb-3">📊</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Rekap Presensi Siswa
          </h1>
          <p className="text-sm opacity-70 text-gray-600 dark:text-gray-300 mt-1">
            Pantau kehadiran siswa per kelas dan bulan
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kelas
            </label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            >
              {daftarKelas.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bulan
            </label>
            <select
              value={bulan}
              onChange={(e) => setBulan(Number(e.target.value))}
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleDateString("id-ID", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tahun
            </label>
            <select
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            >
              {[2025, 2026, 2027].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExport}
              disabled={dataPresensi.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Memuat data presensi...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="border border-blue-500/40 bg-blue-500/5 px-4 py-3 rounded-xl text-center">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Total Presensi
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {totalHari}
                </div>
              </div>
              <div className="border border-green-500/40 bg-green-500/5 px-4 py-3 rounded-xl text-center">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                  <UserCheck size={14} /> Hadir
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {countByStatus("hadir")}
                </div>
              </div>
              <div className="border border-yellow-500/40 bg-yellow-500/5 px-4 py-3 rounded-xl text-center">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                  <Clock size={14} /> Sakit + Izin
                </div>
                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {countByStatus("sakit") + countByStatus("izin")}
                </div>
              </div>
              <div className="border border-red-500/40 bg-red-500/5 px-4 py-3 rounded-xl text-center">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                  <UserX size={14} /> Alpha
                </div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {countByStatus("alpha")}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-700">
              {siswaList.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data siswa
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="px-4 py-3 text-left text-xs font-semibold">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">Nama</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">Hadir</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">Sakit</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">Izin</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">Alpha</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                    {siswaList.map((siswa, i) => {
                      const stats = getStudentStats(siswa.nisn);
                      const persentase =
                        stats.total > 0
                          ? Math.round((stats.hadir / stats.total) * 100)
                          : 0;
                      return (
                        <tr
                          key={siswa.nisn}
                          className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {siswa.nama}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-green-600 dark:text-green-400 font-medium">
                            {stats.hadir}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-yellow-600 dark:text-yellow-400 font-medium">
                            {stats.sakit}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-blue-600 dark:text-blue-400 font-medium">
                            {stats.izin}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-red-600 dark:text-red-400 font-medium">
                            {stats.alpha}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${persentase >= 80 ? "bg-green-500" : persentase >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                                  style={{ width: `${persentase}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {persentase}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-right">
              Total data: {totalHari} hari
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
