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
