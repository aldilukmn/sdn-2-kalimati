"use client";

import Link from "next/link";
import {
  CalendarCheck,
  AlertCircle,
  Users,
  CheckCircle2,
  HeartPulse,
  FileText,
  XCircle,
  TrendingUp,
  ArrowRight,
  UserMinus,
  UserCheck,
  UserX,
  BarChart3,
  CalendarDays,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardPresensi, type ViewMode } from "@/hooks/useDashboardPresensi";
import { GRADES } from "@/lib/constants";
import { MONTHS_ID } from "@/lib/format";
import PageHero from "@/app/components/PageHero";
import StatCard from "@/app/components/StatCard";
import LoadingSkeleton from "@/app/components/shared/LoadingSkeleton";
import AttendanceTrendChart from "@/app/components/AttendanceTrendChart";
import AttendanceBarChart from "@/app/components/AttendanceBarChart";
import DateDayPicker from "@/app/components/DateDayPicker";
import { AVAILABLE_YEARS } from "@/lib/constants";

// ── helpers ─────────────────────────────────────────────────────────────────
const RATE_COLOR = (rate: number) => {
  if (rate >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 75) return "text-blue-600 dark:text-blue-400";
  if (rate >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

const ABSEN_COLOR = (n: number) => {
  if (n === 0) return "text-emerald-600 dark:text-emerald-400";
  if (n <= 2) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

// ── toggle mode ──────────────────────────────────────────────────────────────
function ViewToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  const btn = (m: ViewMode, label: string, Icon: React.ElementType) => (
    <button
      key={m}
      onClick={() => onChange(m)}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
        mode === m
          ? "bg-indigo-600 text-white shadow"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
      {btn("bulanan", "Bulanan", Calendar)}
      {btn("harian", "Harian", CalendarDays)}
    </div>
  );
}

// ── distribution bar ─────────────────────────────────────────────────────────
function DistBar({
  label,
  count,
  total,
  colorBar,
  colorText,
  subtitle,
}: {
  label: string;
  count: number;
  total: number;
  colorBar: string;
  colorText: string;
  subtitle?: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-14 shrink-0">
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
        {subtitle && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorBar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-8 text-right ${colorText}`}>
        {count}
      </span>
      <span className="text-[11px] text-slate-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function DashboardPresensiPage() {
  const { role: userRole, grade: userGrade } = useAuth();

  const {
    viewMode,
    setViewMode,
    grade,
    setGrade,
    month,
    setMonth,
    year,
    setYear,
    selectedDate,
    setSelectedDate,
    trendYear,
    setTrendYear,
    summary,
    gradeRows,
    topAbsen,
    topLowHadir,
    totalStudents,
    avgHadirPerSiswa,
    loading,
    initialLoading,
    error,
    retry,
    hasData,
  } = useDashboardPresensi(userRole, userGrade);

  const isAdminOrKepala = userRole === "admin" || userRole === "kepala";
  const isHarian = viewMode === "harian";

  // Subtitle untuk stat cards — beda antara bulanan dan harian
  const statSubtitle = isHarian
    ? `dari ${totalStudents} siswa`
    : avgHadirPerSiswa !== null
    ? `rata-rata ${avgHadirPerSiswa} hari/siswa`
    : undefined;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={CalendarCheck}
        title="Dashboard Presensi"
        description="Ringkasan kehadiran siswa per kelas"
      />

      {/* ── Filter ─────────────────────────────────────────────────────── */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        {/* Toggle mode */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Mode Tampilan
          </span>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Kelas */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Kelas
            </label>
            <Select
              value={grade}
              onValueChange={(v) => v && setGrade(v)}
              disabled={userRole === "guru"}
            >
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue />
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

          {isHarian ? (
            /* Mode Harian: pilih tanggal */
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Tanggal
              </label>
              <DateDayPicker
                value={selectedDate}
                onChange={setSelectedDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          ) : (
            /* Mode Bulanan: pilih bulan + tahun */
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Bulan
                </label>
                <Select
                  value={String(month)}
                  onValueChange={(v) => v && setMonth(Number(v))}
                >
                  <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                    <SelectValue placeholder="Bulan" className="sr-only" />
                    {MONTHS_ID[month - 1]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bulan</SelectLabel>
                      {MONTHS_ID.map((name, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Tahun
                </label>
                <Select
                  value={String(year)}
                  onValueChange={(v) => v && setYear(Number(v))}
                >
                  <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tahun</SelectLabel>
                      {AVAILABLE_YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      {error ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle
              size={40}
              className="mx-auto text-red-300 dark:text-red-600 mb-3"
            />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button
              onClick={retry}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : initialLoading ? (
        <LoadingSkeleton rows={1} />
      ) : !hasData ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <CalendarCheck
              size={40}
              className="mx-auto text-slate-300 dark:text-slate-600 mb-3"
            />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {isHarian
                ? "Belum ada data presensi untuk tanggal ini."
                : "Belum ada data presensi untuk periode ini."}
            </p>
            <Link
              href="/presensi-murid"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Input Presensi
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ── 5 Stat Cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Hadir"
              value={summary?.hadir ?? 0}
              icon={CheckCircle2}
              color="emerald"
              loading={loading}
              subtitle={isHarian ? `dari ${totalStudents} siswa` : avgHadirPerSiswa !== null ? `rata-rata ${avgHadirPerSiswa} hari/siswa` : undefined}
            />
            <StatCard
              label="Sakit"
              value={summary?.sakit ?? 0}
              icon={HeartPulse}
              color="yellow"
              loading={loading}
              subtitle={isHarian ? `siswa` : undefined}
            />
            <StatCard
              label="Izin"
              value={summary?.izin ?? 0}
              icon={FileText}
              color="blue"
              loading={loading}
              subtitle={isHarian ? `siswa` : undefined}
            />
            <StatCard
              label="Alpa"
              value={summary?.absen ?? 0}
              icon={XCircle}
              color="red"
              loading={loading}
              subtitle={isHarian ? `siswa` : undefined}
            />
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                label="Tingkat Hadir"
                value={summary?.hadirRate ?? 0}
                suffix="%"
                icon={TrendingUp}
                color="indigo"
                loading={loading}
                subtitle={isHarian ? `hari ini` : `bulan ini`}
              />
            </div>
          </div>

          {/* ── Distribusi Status ─────────────────────────────────────── */}
          <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-1">
              <Users
                size={16}
                className="text-indigo-500 dark:text-indigo-400 shrink-0"
              />
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Distribusi Status Kehadiran
              </h3>
            </div>
            {/* Konteks agar tidak membingungkan */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">
              {isHarian
                ? `Total ${totalStudents} siswa terdaftar di kelas ini`
                : `Total entri per siswa selama bulan yang dipilih — % dihitung dari keseluruhan`}
            </p>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <DistBar
                  label="Hadir"
                  count={summary?.hadir ?? 0}
                  total={summary?.total ?? 0}
                  colorBar="bg-emerald-500"
                  colorText="text-emerald-600 dark:text-emerald-400"
                  subtitle={isHarian ? "siswa" : "entri"}
                />
                <DistBar
                  label="Sakit"
                  count={summary?.sakit ?? 0}
                  total={summary?.total ?? 0}
                  colorBar="bg-amber-400"
                  colorText="text-amber-600 dark:text-amber-400"
                  subtitle={isHarian ? "siswa" : "entri"}
                />
                <DistBar
                  label="Izin"
                  count={summary?.izin ?? 0}
                  total={summary?.total ?? 0}
                  colorBar="bg-blue-500"
                  colorText="text-blue-600 dark:text-blue-400"
                  subtitle={isHarian ? "siswa" : "entri"}
                />
                <DistBar
                  label="Alpa"
                  count={summary?.absen ?? 0}
                  total={summary?.total ?? 0}
                  colorBar="bg-red-500"
                  colorText="text-red-600 dark:text-red-400"
                  subtitle={isHarian ? "siswa" : "entri"}
                />
              </div>
            )}
          </div>

          {/* ── Konten mode BULANAN saja ──────────────────────────────── */}
          {!isHarian && (
            <>
              {/* Tren Kehadiran Bulanan */}
              <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      size={16}
                      className="text-indigo-500 dark:text-indigo-400 shrink-0"
                    />
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Tren Kehadiran Bulanan
                    </h3>
                  </div>
                  <Select
                    value={String(trendYear)}
                    onValueChange={(v) => v && setTrendYear(Number(v))}
                  >
                    <SelectTrigger className="w-28 h-auto rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tahun</SelectLabel>
                        {AVAILABLE_YEARS.map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <AttendanceTrendChart year={trendYear} grade={grade} />
              </div>

              {/* Kehadiran per Kelas (admin/kepala only) */}
              {isAdminOrKepala && gradeRows.length > 0 && (
                <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3
                      size={16}
                      className="text-indigo-500 dark:text-indigo-400 shrink-0"
                    />
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Kehadiran per Kelas
                    </h3>
                  </div>
                  <AttendanceBarChart data={gradeRows} loading={loading} />
                </div>
              )}

              {/* Dua tabel insight (bulanan) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Tabel: Siswa Alpa Terbanyak */}
                <InsightTable
                  title="Siswa Alpa Terbanyak"
                  icon={<UserX size={16} className="text-red-500 dark:text-red-400 shrink-0" />}
                  headerClass="from-red-600 to-rose-600"
                  hoverClass="hover:bg-red-50/50 dark:hover:bg-red-900/20"
                  rows={topAbsen}
                  col3Label="Alpa"
                  col3Value={(r) => ({
                    val: r.absen,
                    cls: ABSEN_COLOR(r.absen),
                  })}
                  col4Value={(r) => ({
                    val: `${r.hadirRate}%`,
                    cls: RATE_COLOR(r.hadirRate),
                  })}
                />

                {/* Tabel: Siswa Kehadiran Terendah */}
                <InsightTable
                  title="Siswa Kehadiran Terendah"
                  icon={<UserCheck size={16} className="text-amber-500 dark:text-amber-400 shrink-0" />}
                  headerClass="from-amber-500 to-orange-500"
                  hoverClass="hover:bg-amber-50/50 dark:hover:bg-amber-900/20"
                  rows={topLowHadir}
                  col3Label="Hadir"
                  col3Value={(r) => ({
                    val: r.hadir,
                    cls: "text-slate-700 dark:text-slate-200",
                  })}
                  col4Value={(r) => ({
                    val: `${r.hadirRate}%`,
                    cls: RATE_COLOR(r.hadirRate),
                  })}
                />
              </div>
            </>
          )}

          {/* ── Konten mode HARIAN saja ───────────────────────────────── */}
          {isHarian && (
            <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <UserMinus size={16} className="text-red-500 dark:text-red-400 shrink-0" />
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Siswa Tidak Hadir Hari Ini
                </h3>
              </div>
              <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <TableHead className="w-10 text-center text-xs font-semibold text-white">No</TableHead>
                      <TableHead className="text-xs font-semibold text-white">Nama Siswa</TableHead>
                      <TableHead className="text-center text-xs font-semibold text-white w-24">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topAbsen.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-sm text-emerald-500 dark:text-emerald-400 font-medium">
                          🎉 Semua siswa hadir!
                        </TableCell>
                      </TableRow>
                    ) : (
                      topAbsen.map((row, i) => (
                        <TableRow
                          key={row.studentId}
                          className="hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-colors"
                        >
                          <TableCell className="text-center text-xs text-slate-500">{i + 1}</TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                              {row.name}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {(() => {
                              const label = row.absen > 0 ? "Alpa" : row.sakit > 0 ? "Sakit" : "Izin";
                              const colors = row.absen > 0
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : row.sakit > 0
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
                              return (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors}`}>
                                  {label}
                                </span>
                              );
                            })()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Footer link */}
          <div className="text-center">
            <Link
              href="/rekap-presensi"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              Lihat Rekap Lengkap
              <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// ── Reusable insight table ────────────────────────────────────────────────────
function InsightTable({
  title,
  icon,
  headerClass,
  hoverClass,
  rows,
  col3Label,
  col3Value,
  col4Value,
}: {
  title: string;
  icon: React.ReactNode;
  headerClass: string;
  hoverClass: string;
  rows: {
    studentId: string;
    name: string;
    hadir: number;
    sakit: number;
    izin: number;
    absen: number;
    total: number;
    hadirRate: number;
  }[];
  col3Label: string;
  col3Value: (r: (typeof rows)[0]) => { val: string | number; cls: string };
  col4Value: (r: (typeof rows)[0]) => { val: string | number; cls: string };
}) {
  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className={`bg-gradient-to-r ${headerClass} text-white`}>
              <TableHead className="w-10 text-center text-xs font-semibold text-white">No</TableHead>
              <TableHead className="text-xs font-semibold text-white">Nama Siswa</TableHead>
              <TableHead className="text-center text-xs font-semibold text-white w-14">{col3Label}</TableHead>
              <TableHead className="text-center text-xs font-semibold text-white w-16">Hadir %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-sm text-slate-400 dark:text-slate-500">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => {
                const c3 = col3Value(row);
                const c4 = col4Value(row);
                return (
                  <TableRow key={row.studentId} className={`${hoverClass} transition-colors`}>
                    <TableCell className="text-center text-xs text-slate-500">{i + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{row.name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-bold ${c3.cls}`}>{c3.val}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-bold ${c4.cls}`}>{c4.val}</span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
