"use client";

import { useEffect, useState } from "react";
import { Loader2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableSkeleton from "@/components/tables/TableSkeleton";
import StudentAttendanceService from "@/services/student-attendance.service";
import UserService from "@/services/user.service";
import { exportPresensiRecapToCSV } from "@/lib/export-presensi-csv";
import BackButton from "../components/common/BackButton";
import Pagination from "@/components/common/Pagination";
import MonthYearPicker from "../components/common/MonthYearPicker";
import { GRADES } from "@/lib/constants";
import type {
  MasterStudentType,
  AttendanceReportItem,
  StudentAttendanceType
} from "@/types/attendance";
import { useAuth } from "@/hooks/useAuth";

export default function RekapPresensi() {
  const { role, grade: userGrade } = useAuth();
  const [grade, setGrade] = useState(userGrade || "1");

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [dataPresensi, setDataPresensi] = useState<AttendanceReportItem[]>([]);
  const [siswaList, setSiswaList] = useState<MasterStudentType[]>([]);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSiswa = async (signal?: AbortSignal) => {
    try {
      const response = await StudentAttendanceService.getStudentsByGrade(grade);
      if (signal?.aborted) return;
      const data = response.data || response.result || [];
      setSiswaList(data);
    } catch {
      if (signal?.aborted) return;
      setSiswaList([]);
    }
  };

  const fetchTeacher = async (signal?: AbortSignal) => {
    setTeacherLoading(true);
    try {
      const res = await UserService.getTeacherByGrade(grade);
      if (signal?.aborted) return;
      const teacher = res?.result;
      setTeacherName(teacher?.fullName || null);
    } catch {
      if (signal?.aborted) return;
      setTeacherName(null);
    } finally {
      if (signal?.aborted) return;
      setTeacherLoading(false);
    }
  };

  const fetchAllPresensi = async (signal?: AbortSignal) => {
    try {
      const response = await StudentAttendanceService.getReportByGrade(
        grade,
        month,
        year,
      );
      if (signal?.aborted) return;
      const data = response.data || response.result || [];
      setDataPresensi(data);
    } catch {
      if (signal?.aborted) return;
      setError("Gagal memuat data presensi");
    } finally {
      if (signal?.aborted) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "guru" && userGrade) {
      setGrade(userGrade);
    }
  }, [role, userGrade]);

  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;
    setLoading(true);
    setError(null);
    setTeacherName(null);
    setTeacherLoading(true);
    setCurrentPage(1);
    fetchSiswa(signal);
    fetchTeacher(signal);
    fetchAllPresensi(signal);
    return () => ctrl.abort();
  }, [grade, month, year]);

  const handleExport = () => {
    const rows = siswaList.map((siswa) => {
      const stats = getStudentStats(siswa.studentId);
      return {
        studentId: siswa.studentId,
        name: siswa.name,
        grade,
        hadir: stats.hadir,
        sakit: stats.sakit,
        izin: stats.izin,
        absen: stats.absen,
      };
    });
    exportPresensiRecapToCSV(rows, `grade-${grade}-month-${month}`);
  };

  const getStudentStats = (studentId: string) => {
    const record = dataPresensi.find((d) => d.studentId === studentId || d._id === studentId);
    if (!record) return { total: 0, hadir: 0, sakit: 0, izin: 0, absen: 0 };
    const hadir = record.hadir ?? 0;
    const sakit = record.sakit ?? 0;
    const izin = record.izin ?? 0;
    const absen = record.absen ?? 0;
    return { total: hadir + sakit + izin + absen, hadir, sakit, izin, absen };
  };

  const totalPages = Math.ceil(siswaList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSiswa = siswaList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col items-center justify-start gap-6 px-4 py-7 xl:py-10 min-h-screen">
      <div className="w-full max-w-6xl">
        <BackButton />
      </div>
      <Card className="w-full max-w-6xl p-5 md:p-8 border-none bg-white/70 dark:bg-gray-800/40 shadow-xl backdrop-blur-md rounded-3xl flex flex-col gap-6">
        <div className="text-center mb-2">
          <div className="text-4xl md:text-5xl mb-4 drop-shadow-sm">📊</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Rekap Presensi Siswa
          </h1>
          <p className="text-sm opacity-70 text-gray-600 dark:text-gray-300 mt-2">
            Pantau kehadiran siswa per kelas dan bulan
          </p>
        </div>

        <div className="relative z-20 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-end justify-between gap-5">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-32">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kelas
              </label>
              <Select
                value={grade}
                disabled={role === "guru"}
                onValueChange={(v) => {
                  if (v !== null) setGrade(v);
                }}
              >
                <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                  <SelectValue placeholder="Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kelas</SelectLabel>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        Kelas {g}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Periode
              </label>
              <MonthYearPicker
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
              />
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end w-full md:w-auto gap-3">
             <div className="h-9 flex items-center justify-center">
              {teacherLoading ? (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  👤 Wali Kelas: <span className="inline-block h-3.5 w-24 bg-purple-300 dark:bg-purple-600 rounded animate-pulse" />
                </span>
              ) : teacherName ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  👤 Wali Kelas: {teacherName}
                </span>
              ) : null}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleExport}
                disabled={dataPresensi.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Download size={18} />
                CSV
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
            <TableSkeleton
              headers={[
                "No",
                "Nama",
                "Hadir",
                "Sakit",
                "Izin",
                "Absen",
                "Kehadiran",
              ]}
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
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </td>
                </>
              )}
            </TableSkeleton>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30">
              {siswaList.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data siswa
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
                      <th className="px-4 py-3 text-left text-xs font-semibold">
                        No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">
                        Nama
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Hadir
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Sakit
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Izin
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Absen
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold">
                        Kehadiran
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedSiswa.map((siswa, i) => {
                      const stats = getStudentStats(siswa.studentId);
                      const persentase =
                        stats.total > 0
                          ? Math.round((stats.hadir / stats.total) * 100)
                          : 0;
                      return (
                        <tr
                          key={siswa.studentId}
                          className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors animate-fadeIn"
                        >
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {startIndex + i + 1}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {siswa.name}
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
                            {stats.absen}
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

            {siswaList.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={siswaList.length}
                />
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-right">
              Total siswa: {dataPresensi.length} siswa
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
