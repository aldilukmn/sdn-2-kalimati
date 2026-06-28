"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX,
  Clock,
  FileText,
} from "lucide-react";
import { Card } from "flowbite-react";
import TableSkeleton from "@/app/components/TableSkeleton";
import Pagination from "@/app/components/Pagination";
import StudentAttendanceService from "@/services/student-attendance.service";

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
  studentId: string;
  name: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
}

const GRADES = ["1", "2", "3", "4", "5", "6"];

export default function PresensiMuridPage() {
  const router = useRouter();

  const [grade, setGrade] = useState("1");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setUserGrade(payload.grade);
        if (payload.role === "guru" && payload.grade) {
          setGrade(payload.grade);
        }
      } catch {}
    }
    setIsJwtReady(true);
  }, []);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isExisting, setIsExisting] = useState(false);
  const [loadingSiswa, setLoadingSiswa] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isJwtReady, setIsJwtReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (userRole && userRole !== "guru" && userRole !== "admin") {
      router.replace("/login");
    }
  }, [userRole, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [grade, date]);

  useEffect(() => {
    if (!isJwtReady || !grade || !date) return;

    const hasEntries = entries.length > 0;

    const loadData = async () => {
      if (hasEntries) {
        setSyncing(true);
      } else {
        setLoadingSiswa(true);
      }
      setMessage(null);
      try {
        const [siswaRes, presensiRes] = await Promise.all([
          StudentAttendanceService.getStudentsByGrade(grade),
          StudentAttendanceService.getByGradeAndDate(grade, date),
        ]);

        const siswaList = siswaRes.data || siswaRes.result || [];
        const presensiData = presensiRes.data || presensiRes.result || [];

        if (presensiData.length > 0) {
          const merged = siswaList.map((s: any) => {
            const existing = presensiData.find(
              (e: any) => e.studentId === s.studentId
            );
            return {
              studentId: s.studentId,
              name: s.name,
              status: existing?.status || ("hadir" as const),
            };
          });
          setEntries(merged);
          setIsExisting(true);
          setMessage({
            type: "success",
            text: "Data presensi sudah ada. Silakan edit jika perlu.",
          });
        } else {
          setEntries(
            siswaList.map((s: any) => ({
              studentId: s.studentId,
              name: s.name,
              status: "hadir" as const,
            }))
          );
          setIsExisting(false);
        }
      } catch {
        setEntries([]);
        setIsExisting(false);
      } finally {
        setLoadingSiswa(false);
        setSyncing(false);
      }
    };

    loadData();
  }, [grade, date, isJwtReady]);

  const handleStatusChange = (studentId: string, status: Entry["status"]) => {
    setEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, status } : e))
    );
  };

  const handleSave = async () => {
    if (!date || !grade || entries.length === 0) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload: StudentAttendanceRequestType = {
        date,
        grade,
        entries: entries.map((e) => ({
          studentId: e.studentId,
          status: e.status,
        })),
      };
      await StudentAttendanceService.create(payload);
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

  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = entries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col items-center justify-start gap-6 px-4 py-7 xl:py-10">
      <Card className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <div className="text-4xl md:text-5xl mb-3">📋</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Presensi Murid Harian
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
            {userRole !== "admin" ? (
              <div className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100">
                Kelas {grade}
              </div>
            ) : (
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Kelas {g}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"
            />
          </div>
        </div>

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

          {loadingSiswa ? (
            <TableSkeleton
              headers={["No", "Nama Siswa", "Student ID", "Status Kehadiran"]}
              rows={5}
            >
              {() => (
                <>
                  <td className="px-4 py-3">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                  </td>
                </>
              )}
            </TableSkeleton>
          ) : entries.length === 0 ? (
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
                        Student ID
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Status Kehadiran
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                    {paginatedEntries.map((entry, i) => (
                      <tr
                        key={entry.studentId}
                        className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {startIndex + i + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {entry.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 text-center">
                          {entry.studentId}
                        </td>
                        <td className="px-4 py-3">
                          {syncing ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                              <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                              <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                              <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              {(
                                ["hadir", "sakit", "izin", "alpha"] as const
                              ).map((status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleStatusChange(entry.studentId, status)
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                    entry.status === status
                                      ? STATUS_BTN[status]
                                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                  }`}
                                >
                                  {STATUS_LABEL[status]}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {entries.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={entries.length}
                  />
                </div>
              )}

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
      </Card>
    </div>
  );
}
