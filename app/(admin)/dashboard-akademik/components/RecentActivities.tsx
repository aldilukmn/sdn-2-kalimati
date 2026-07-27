"use client";

import { Activity, BookOpen, FileText, Users, PieChart, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface RecentActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  subject: string;
}

interface RecentActivitiesProps {
  activities?: RecentActivity[];
  loading: boolean;
}

export function RecentActivities({ activities = [], loading }: RecentActivitiesProps) {
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "nilai harian":
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case "tugas":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "keaktifan":
      case "partisipasi":
        return <Users className="w-5 h-5 text-amber-500" />;
      case "litnum":
        return <PieChart className="w-5 h-5 text-emerald-500" />;
      default:
        return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "nilai harian":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300";
      case "tugas":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      case "keaktifan":
      case "partisipasi":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
      case "litnum":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col min-h-[400px]">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Aktivitas Terbaru
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Aktivitas Terbaru
        </h3>
        <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
          {activities.length} aktivitas
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              <Activity className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Belum ada aktivitas</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Data penilaian yang baru ditambahkan akan muncul di sini.
              </p>
            </div>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="group flex gap-4 p-3.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-default"
            >
              <div className="w-10 h-10 shrink-0 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                {getIcon(activity.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate" title={activity.title}>
                    {activity.title}
                  </h4>
                  <span className="shrink-0 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: id })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getBadgeColor(activity.category)}`}>
                    {activity.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {activity.subject}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
