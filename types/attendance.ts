export interface MasterStudentType {
  _id?: string;
  studentId: string;
  name: string;
  grade: string;
  gender?: string;
  nisn?: string;
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
  /** Returned as _id from MongoDB aggregate grouping */
  _id?: string;
  studentId: string;
  name?: string;
  status?: "hadir" | "sakit" | "izin" | "absen";
  hadir?: number;
  sakit?: number;
  izin?: number;
  absen?: number;
}
