"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import DashboardService from "@/services/dashboard.service";
import type { AttendanceTrendItem } from "@/types/dashboard";

interface Props {
  year: number;
  grade?: string;
  loading?: boolean;
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export default function AttendanceTrendChart({ year, grade, loading: parentLoading }: Props) {
  const [data, setData] = useState<AttendanceTrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await DashboardService.getAttendanceTrend(year, grade);
        if (!cancelled) {
          setData(res.result || []);
        }
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; controller.abort(); };
  }, [year, grade]);

  const isLoading = parentLoading ?? loading;

  if (isLoading) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[250px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
        Belum ada data tren kehadiran
      </div>
    );
  }

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
          <XAxis
            dataKey="month"
            tickFormatter={(m) => MONTHS_SHORT[m - 1]}
            tick={{ fontSize: 11, className: "fill-gray-500 dark:fill-gray-400" }}
            axisLine={{ className: "stroke-gray-300 dark:stroke-gray-600" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, className: "fill-gray-500 dark:fill-gray-400" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any) => [`${value}%`, "Kehadiran"]}
            labelFormatter={(m: any) => MONTHS_SHORT[m - 1]}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }}
            isAnimationActive={true}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
