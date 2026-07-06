"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import StudentSavingsService from "@/services/student-savings.service";
import type { MonthlyTrendItem } from "@/types/student-savings";

interface Props {
  year: number;
  grade?: string;
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const formatRp = (v: number) =>
  v >= 1_000_000
    ? `Rp${(v / 1_000_000).toFixed(1)}jt`
    : v >= 1_000
      ? `Rp${(v / 1_000).toFixed(0)}rb`
      : `Rp${v}`;

export default function SavingsTrendChart({ year, grade }: Props) {
  const [data, setData] = useState<MonthlyTrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await StudentSavingsService.getMonthlyTrend(year, grade);
        if (!cancelled) setData(res.result || []);
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [year, grade]);

  if (loading) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[250px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
        Belum ada data tabungan
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
          <XAxis
            dataKey="month"
            tickFormatter={(m) => MONTHS_SHORT[m - 1]}
            tick={{ fontSize: 11, className: "fill-gray-500 dark:fill-gray-400" }}
            axisLine={{ className: "stroke-gray-300 dark:stroke-gray-600" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatRp}
            tick={{ fontSize: 11, className: "fill-gray-500 dark:fill-gray-400" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any, name: any) => [
              formatRp(value),
              name === "deposits" ? "Setoran" : "Penarikan",
            ]}
            labelFormatter={(m: any) => MONTHS_SHORT[m - 1]}
          />
          <Legend
            formatter={(value: string) =>
              value === "deposits" ? "Setoran" : "Penarikan"
            }
          />
          <Line
            type="monotone"
            dataKey="deposits"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
            name="deposits"
            isAnimationActive={true}
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="withdrawals"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#ef4444", strokeWidth: 0 }}
            name="withdrawals"
            isAnimationActive={true}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
