export interface MasterStudentType {
  studentId: string;
  name: string;
  grade: string;
}

export interface StudentAttendanceType {
  studentId: string;
  name: string;
  grade: string;
  date: string;
  status: "hadir" | "sakit" | "izin" | "absen";
  note?: string;
}

export interface StudentAttendanceRequestType {
  date: string;
  grade: string;
  entries: { studentId: string; status: "hadir" | "sakit" | "izin" | "absen" }[];
}

export interface AttendanceReportItem {
  studentId: string;
  _id?: string;
  status?: "hadir" | "sakit" | "izin" | "absen";
  hadir?: number;
  sakit?: number;
  izin?: number;
  absen?: number;
}
