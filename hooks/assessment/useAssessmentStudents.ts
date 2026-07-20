import { useEffect, useState } from "react";
import StudentAttendanceService from "@/services/student-attendance.service";

export function useAssessmentStudents(role: string | null, grade: string, retryCount: number) {
  const [students, setStudents] = useState<{ studentId: string; name: string }[]>([]);

  useEffect(() => {
    if (!role || !grade) { setStudents([]); return; }
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await StudentAttendanceService.getStudentsByGrade(grade);
        const fetchedStudents = res?.result || [];
        fetchedStudents.sort((a, b) => {
          const idA = a.studentId || "";
          const idB = b.studentId || "";
          return idA.localeCompare(idB, undefined, { numeric: true });
        });
        setStudents(fetchedStudents);
      } catch {
        setStudents([]);
      }
    })();
    return () => ctrl.abort();
  }, [role, grade, retryCount]);

  return { students };
}
