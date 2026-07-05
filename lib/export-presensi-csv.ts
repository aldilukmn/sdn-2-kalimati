import { getTodayLocal } from "./format";
import { wrap, downloadCSV } from "./csv-utils";

interface AttendanceRow {
  studentId: string;
  name: string;
  grade: string;
  date: string;
  status: string;
}

interface AttendanceRecapRow {
  studentId: string;
  name: string;
  grade: string;
  hadir: number;
  sakit: number;
  izin: number;
  absen: number;
}

const HEADERS = [
  "No",
  "Student ID",
  "Nama Lengkap",
  "Kelas",
  "Tanggal",
  "Status",
];

const RECAP_HEADERS = [
  "No",
  "Student ID",
  "Nama Lengkap",
  "Kelas",
  "Hadir",
  "Sakit",
  "Izin",
  "Absen",
];

export function exportPresensiToCSV(
  data: AttendanceRow[],
  label: string
): void {
  const rows = data.map((r, i) =>
    [
      i + 1,
      r.studentId,
      r.name,
      `Kelas ${r.grade}`,
      r.date,
      r.status.charAt(0).toUpperCase() + r.status.slice(1),
    ]
      .map(wrap)
      .join(",")
  );

  downloadCSV(HEADERS, rows, `presensi-${label}-${getTodayLocal()}.csv`);
}

export function exportPresensiRecapToCSV(
  data: AttendanceRecapRow[],
  label: string
): void {
  const rows = data.map((r, i) =>
    [
      i + 1,
      r.studentId,
      r.name,
      `Kelas ${r.grade}`,
      r.hadir,
      r.sakit,
      r.izin,
      r.absen,
    ]
      .map(wrap)
      .join(",")
  );

  downloadCSV(RECAP_HEADERS, rows, `rekap-presensi-${label}-${getTodayLocal()}.csv`);
}
