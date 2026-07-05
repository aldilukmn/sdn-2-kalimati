import type { MasterStudentType, AttendanceReportItem } from "@/types/attendance";

export interface AttendanceRow {
  _id: string;
  studentIndex: number;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  absen: number;
}

type AttendanceMapValue = { hadir: number; sakit: number; izin: number; absen: number };

export function mergeAttendance(
  students: MasterStudentType[],
  attendance: AttendanceReportItem[]
): { data: AttendanceRow[]; hasData: boolean } {
  const attendanceMap = new Map<string, AttendanceMapValue>();
  for (const a of attendance) {
    const key = a.studentId || a._id || "";
    if (!attendanceMap.has(key)) {
      attendanceMap.set(key, { hadir: 0, sakit: 0, izin: 0, absen: 0 });
    }
    const r = attendanceMap.get(key)!;
    if (a.status) {
      if (a.status === "hadir") r.hadir++;
      else if (a.status === "sakit") r.sakit++;
      else if (a.status === "izin") r.izin++;
      else if (a.status === "absen") r.absen++;
    } else {
      r.hadir += a.hadir ?? 0;
      r.sakit += a.sakit ?? 0;
      r.izin += a.izin ?? 0;
      r.absen += a.absen ?? 0;
    }
  }

  const data = students.map((s, idx: number) => {
    const a = attendanceMap.get(s.studentId);
    return {
      _id: s.studentId,
      studentIndex: idx,
      name: s.name,
      hadir: a?.hadir ?? 0,
      sakit: a?.sakit ?? 0,
      izin: a?.izin ?? 0,
      absen: a?.absen ?? 0,
    };
  });

  const hasData = data.some(
    (m) => m.hadir > 0 || m.sakit > 0 || m.izin > 0 || m.absen > 0
  );

  return { data, hasData };
}
