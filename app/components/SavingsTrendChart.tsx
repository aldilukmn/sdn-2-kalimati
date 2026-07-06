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
  LabelList,
} from "recharts";
import StudentSavingsService from "@/services/student-savings.service";
import type { MonthlyTrendItem } from "@/types/student-savings";
import { formatCompactRupiah, MONTHS_ID } from "@/lib/format";

interface Props {
  year: number;
  grade?: string;
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const formatRp = formatCompactRupiah;

export default function SavingsTrendChart({ year, grade }: Props) {
  const [data, setData] = useState<MonthlyTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" className="dark:opacity-20" />
          <XAxis
            type="number"
            dataKey="month"
            tickFormatter={(m) => MONTHS_SHORT[m - 1]}
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
            allowDecimals={false}
            ticks={data.map((d) => d.month)}
            tick={{ fontSize: 11, className: "fill-gray-600 dark:fill-gray-300" }}
            axisLine={{ className: "stroke-gray-400 dark:stroke-gray-500" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatRp}
            tick={{ fontSize: 11, className: "fill-gray-600 dark:fill-gray-300" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-sm">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {MONTHS_ID[(label as number) - 1]} {year}
                  </p>
                  {payload.map((entry: any) => (
                    <p key={entry.name} className="leading-5" style={{ color: entry.color }}>
                      <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ backgroundColor: entry.color }} />
                      <span className="font-medium">{entry.name === "deposits" ? "Setoran" : "Penarikan"}</span>
                      : {formatRp(entry.value as number)}
                    </p>
                  ))}
                </div>
              );
            }}
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
            dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
            name="deposits"
            isAnimationActive={true}
            animationDuration={1200}
          >
            {isDesktop && (
              <LabelList
                dataKey="deposits"
                position="top"
                formatter={(v: any) => formatRp(v)}
                className="text-[10px]"
                fill="#10b981"
                fontWeight={600}
              />
            )}
          </Line>
          <Line
            type="monotone"
            dataKey="withdrawals"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
            name="withdrawals"
            isAnimationActive={true}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
