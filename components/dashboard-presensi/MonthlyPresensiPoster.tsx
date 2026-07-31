import React, { forwardRef } from 'react';
import { MONTHS_ID } from "@/lib/format";
import { Award, AlertTriangle, Users, CalendarCheck, CheckCircle2 } from 'lucide-react';
import type { StudentAbsenceRow, AttendanceSummary } from '@/hooks/useDashboardPresensi';

interface Props {
  month: number;
  year: number;
  grade: number;
  studentRows: StudentAbsenceRow[];
  summary: AttendanceSummary;
}

export const MonthlyPresensiPoster = forwardRef<HTMLDivElement, Props>(({
  month, year, grade, studentRows, summary
}, ref) => {
  const monthName = MONTHS_ID[month - 1];
  
  const totalHariEfektif = studentRows.length > 0 
    ? Math.max(...studentRows.map(s => s.hadir + s.sakit + s.izin + s.absen)) 
    : 0;
  
  const perfectStudents = studentRows.filter(s => s.sakit === 0 && s.izin === 0 && s.absen === 0 && s.hadir > 0);
  const attentionStudents = studentRows.filter(s => s.absen > 0 || (s.sakit + s.izin) > 3).sort((a,b) => b.absen - a.absen || (b.sakit+b.izin) - (a.sakit+a.izin));

  return (
    <div 
      ref={ref} 
      className="w-[800px] bg-slate-50 flex flex-col font-sans text-slate-800" 
      style={{ position: 'absolute', top: 0, left: 0, zIndex: -9999, opacity: 0.001, pointerEvents: 'none' }}
    >
      {/* HEADER */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white relative overflow-hidden rounded-b-[40px] shadow-lg">
        <div className="absolute top-0 right-0 opacity-10">
          <CalendarCheck size={300} className="transform translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Rekapitulasi Kehadiran</h1>
            <h2 className="text-2xl font-medium text-indigo-100">Kelas {grade} - {monthName} {year}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/30 text-center">
            <p className="text-sm font-medium text-indigo-100 uppercase tracking-wider mb-1">Tingkat Kehadiran</p>
            <p className="text-5xl font-black">{summary ? summary.hadirRate : 0}%</p>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="px-10 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-around items-center border border-slate-100">
          <div className="text-center">
            <p className="text-slate-500 font-semibold uppercase tracking-wide text-sm mb-1">Hari Efektif</p>
            <p className="text-3xl font-bold text-slate-700">{totalHariEfektif}</p>
          </div>
          <div className="w-px h-12 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-slate-500 font-semibold uppercase tracking-wide text-sm mb-1">Jumlah Murid</p>
            <p className="text-3xl font-bold text-indigo-600">{studentRows.length}</p>
          </div>
          <div className="w-px h-12 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-slate-500 font-semibold uppercase tracking-wide text-sm mb-1">Sakit</p>
            <p className="text-3xl font-bold text-amber-500">{summary?.sakit || 0}</p>
          </div>
          <div className="w-px h-12 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-slate-500 font-semibold uppercase tracking-wide text-sm mb-1">Izin</p>
            <p className="text-3xl font-bold text-blue-500">{summary?.izin || 0}</p>
          </div>
          <div className="w-px h-12 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-slate-500 font-semibold uppercase tracking-wide text-sm mb-1">Absen</p>
            <p className="text-3xl font-bold text-red-500">{summary?.absen || 0}</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-10 flex flex-col gap-8">
        {/* ROW 1: PERFECT */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
              <Award size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Kehadiran 100%</h3>
              <p className="text-slate-500 text-sm">{perfectStudents.length} murid rajin tanpa absen</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {perfectStudents.length > 0 ? (
              <div className="grid grid-cols-3 gap-y-4 gap-x-6">
                {perfectStudents.map(s => (
                  <div key={s.studentId} className="flex justify-between items-center min-w-0">
                    <span className="text-slate-700 font-medium text-[15px] leading-tight tracking-tight">{s.name}</span>
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4 italic">Belum ada murid dengan kehadiran 100%</p>
            )}
          </div>
        </div>

        {/* ROW 2: ATTENTION */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Perlu Perhatian</h3>
              <p className="text-slate-500 text-sm">Banyak Absen / Sakit / Izin</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {attentionStudents.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {attentionStudents.slice(0, 10).map(s => (
                  <div key={s.studentId} className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">{s.name}</span>
                    <div className="flex gap-1.5 shrink-0">
                      {s.sakit > 0 && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1 py-0.5 rounded-md inline-block w-[54px] text-center">{s.sakit} Sakit</span>}
                      {s.izin > 0 && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1 py-0.5 rounded-md inline-block w-[54px] text-center">{s.izin} Izin</span>}
                      {s.absen > 0 && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1 py-0.5 rounded-md inline-block w-[54px] text-center">{s.absen} Absen</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4 italic">Alhamdulillah, tidak ada murid yang bermasalah.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* FOOTER */}
      <div className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-4">
        Dihasilkan secara otomatis dari Sistem Akademik SD Negeri 2 Kalimati
      </div>
    </div>
  );
});

MonthlyPresensiPoster.displayName = 'MonthlyPresensiPoster';

export default MonthlyPresensiPoster;
