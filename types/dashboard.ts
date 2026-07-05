export interface DashboardSummary {
  totalRegistrants: number;
  validated: number;
  unvalidated: number;
  totalStudents: number;
  totalTeachers: number;
  attendanceByStatus: {
    hadir: number;
    sakit: number;
    izin: number;
    absen: number;
  } | null;
  attendanceByGrade: { grade: string; rate: number; studentCount: number }[] | null;
  totalDays: number;
}

export interface TeacherDashboardSummary {
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
}
