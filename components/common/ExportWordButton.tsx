"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import StudentAttendanceService from "@/services/student-attendance.service";
import HolidayService from "@/services/holiday.service";
import { exportPresensiMatriksToWord } from "@/lib/export-presensi-word";
import { MONTHS_ID } from "@/lib/format";
import type { StudentAttendanceType } from "@/types/attendance";
import toast from "react-hot-toast";
import UserService from "@/services/user.service";

export default function ExportWordButton({
  grade,
  month,
  year,
}: {
  grade: string;
  month: number;
  year: number;
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      // Fetch students, holidays, and teacher data concurrently
      const [studentsRes, holidaysRes, teacherRes, meRes] = await Promise.all([
        StudentAttendanceService.getStudentsByGrade(grade),
        HolidayService.getAll().catch(() => ({ data: [] })),
        UserService.getTeacherByGrade(grade, true).catch(() => ({ data: null })),
        UserService.getMe().catch(() => ({ data: null }))
      ]);
      const siswaList = studentsRes.data || studentsRes.result || [];
      const holidayData = holidaysRes.data || (holidaysRes as any).result || [];
      const teacherByGrade = teacherRes?.data || (teacherRes as any)?.result || null;
      const me = meRes?.data || (meRes as any)?.result || null;
      const teacher = teacherByGrade || me;
      const holidayMap = new Map<string, string>();
      holidayData.forEach((h: any) => holidayMap.set(h.date, h.description));

      if (siswaList.length === 0) {
        toast.error("Belum ada data murid untuk kelas ini.");
        return;
      }

      const daysInMonth = new Date(year, month, 0).getDate();
      const promises: Promise<any>[] = [];

      // Fetch for all days in the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        promises.push(
          StudentAttendanceService.getByGradeAndDate(grade, dateStr).catch(() => ({ data: [] }))
        );
      }

      const results = await Promise.all(promises);
      
      // Build matrix
      const matrix: Record<string, (string | null)[]> = {};
      siswaList.forEach((s: any) => {
        matrix[s.studentId] = Array(daysInMonth).fill(null);
      });

      results.forEach((res, index) => {
        const dayData: StudentAttendanceType[] = res.data || res.result || [];
        dayData.forEach((att) => {
          if (matrix[att.studentId]) {
            matrix[att.studentId][index] = att.status;
          }
        });
      });
      // Fetch logo for KOP
      let base64Logo = "";
      try {
        const logoRes = await fetch('/cop-sekolah.png');
        if (logoRes.ok) {
          const blob = await logoRes.blob();
          base64Logo = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }
      } catch (e) {
        console.warn("Gagal load cop-sekolah.png", e);
      }

      exportPresensiMatriksToWord(
        grade,
        MONTHS_ID[month - 1],
        month,
        year,
        siswaList,
        matrix,
        daysInMonth,
        holidayMap,
        base64Logo,
        teacher
      );
      toast.success("Berhasil mengunduh dokumen Word.");
    } catch (err) {
      toast.error("Gagal melakukan export Word. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportWord}
      disabled={isExporting}
      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto shadow-sm hover:shadow-md hover:-translate-y-0.5"
    >
      {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
      Unduh Word Matriks
    </button>
  );
}
