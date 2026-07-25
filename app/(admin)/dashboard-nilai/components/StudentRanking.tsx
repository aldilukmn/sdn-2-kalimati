import { Trophy, AlertTriangle, ArrowRight } from "lucide-react";
import { StudentStat } from "@/services/academic-dashboard.service";
import Link from "next/link";

interface StudentRankingProps {
  topRajin: StudentStat[];
  bottomPerhatian: StudentStat[];
  loading: boolean;
}

export function StudentRanking({ topRajin, bottomPerhatian, loading }: StudentRankingProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-pulse h-64"></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-pulse h-64"></div>
      </div>
    );
  }

  const renderList = (
    title: string, 
    students: StudentStat[], 
    Icon: React.ElementType, 
    colorClass: string,
    emptyMessage: string
  ) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className={`p-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2 ${colorClass}`}>
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      
      <div className="p-0 flex-1">
        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            {emptyMessage}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {students.map((student, idx) => (
              <li key={student.studentId} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'bg-amber-400 text-white dark:bg-amber-500 shadow-md border border-amber-500 dark:border-amber-400' : 
                  idx === 1 ? 'bg-slate-300 text-slate-700 dark:bg-slate-500 dark:text-white shadow-md border border-slate-400' :
                  idx === 2 ? 'bg-orange-700 text-white dark:bg-orange-600 shadow-md border border-orange-800 dark:border-orange-500' :
                  'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-white truncate">
                    {student.studentName}
                  </p>
                  <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Selesai: {student.completed}/{student.total}</span>
                    <span>Rata-rata: {Math.round(student.averageScore * 100) / 100}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    student.completionRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                    student.completionRate >= 50 ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {Math.floor(student.completionRate * 100) / 100}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderList(
        "Top 5 Paling Rajin",
        topRajin,
        Trophy,
        "bg-gradient-to-r from-emerald-500 to-teal-600",
        "Belum ada data nilai yang diinput."
      )}
      
      {renderList(
        "Top 5 Perlu Perhatian",
        bottomPerhatian,
        AlertTriangle,
        "bg-gradient-to-r from-rose-500 to-orange-600",
        "Belum ada data nilai yang diinput."
      )}
    </div>
  );
}
