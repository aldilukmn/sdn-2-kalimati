"use client";

import { useState, useEffect } from "react";
import { Activity, BookOpen, FileText, Users, PieChart, Clock, ChevronDown, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import toast from "react-hot-toast";
import Pagination from "@/components/common/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [renderContent, setRenderContent] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isExpanded) {
      timer = setTimeout(() => setRenderContent(true), 600);
    } else {
      setRenderContent(false);
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "nilai harian":
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case "tugas":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "keaktifan":
      case "partisipasi":
        return <Users className="w-4 h-4 text-amber-500" />;
      case "litnum":
        return <PieChart className="w-4 h-4 text-emerald-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
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

  const getShortTime = (date: string) => {
    const full = formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
    return full
      .replace("sekitar ", "")
      .replace("kurang dari semenit yang lalu", "baru saja")
      .replace(" yang lalu", " lalu")
      .replace(" menit", "m")
      .replace(" jam", "j")
      .replace(" hari", "h")
      .replace(" bulan", "bln")
      .replace(" tahun", "thn");
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-3 md:p-4 flex items-center justify-between gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer md:cursor-default ${
          isExpanded ? 'border-b border-slate-100 dark:border-slate-700/50' : 'md:border-b md:border-slate-100 md:dark:border-slate-700/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 md:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <h3 className="text-sm md:text-base font-bold text-white">Aktivitas Terbaru</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
            {activities.length} aktivitas
          </span>
          <div className="md:hidden">
            <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-white transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </div>
        </div>
      </div>

      <div className={`md:flex-1 grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr] md:grid-rows-[1fr]"}`}>
        <div className="overflow-hidden min-h-0 md:flex md:flex-col md:h-full">
          {/* Skeleton shown during animation on mobile */}
          {!renderContent && (
            <div className="md:hidden w-full flex flex-col gap-4 p-4 animate-pulse min-h-[200px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`p-4 flex-col ${!renderContent ? 'hidden md:flex' : 'flex'} md:flex-1`}>
            <div className="md:flex-1 pr-2 -mr-2 mb-4">
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
          <div className="space-y-2 pb-2">
            {paginatedActivities.map((activity) => (
            <div
              key={activity.id}
              className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-default"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                <div className="w-8 h-8 shrink-0 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(activity.category)}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate" title={activity.title}>
                      {activity.title}
                    </h4>
                    {activity.title.length > 35 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast(activity.title, { icon: "ℹ️", duration: 4000 });
                        }}
                        className="md:hidden shrink-0 text-amber-500 hover:text-amber-600 cursor-pointer"
                        title="Lihat teks lengkap"
                      >
                        <Info size={16} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-max text-[10px] font-semibold px-2 py-0.5 rounded-full ${getBadgeColor(activity.category)}`}>
                      {activity.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {activity.subject}
                    </span>
                  </div>
                </div>
                
                {/* Mobile Timestamp (visible only on small screens next to title) */}
                <div className="sm:hidden shrink-0 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" />
                  {getShortTime(activity.date)}
                </div>
              </div>
              
              {/* Desktop Timestamp */}
              <div className="hidden sm:flex shrink-0 items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 ml-auto">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: id })}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={activities.length}
          />
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
