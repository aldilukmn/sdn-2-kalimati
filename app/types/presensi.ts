interface MasterStudentType {
  studentId: string;
  name: string;
  grade: string;
}

interface StudentAttendanceType {
  studentId: string;
  name: string;
  grade: string;
  date: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
  note?: string;
}

interface StudentAttendanceRequestType {
  date: string;
  grade: string;
  entries: { studentId: string; status: "hadir" | "sakit" | "izin" | "alpha" }[];
}
