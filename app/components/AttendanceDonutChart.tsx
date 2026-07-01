"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";

interface Props {
  data: { name: string; value: number; color: string }[];
  loading?: boolean;
  totalDays?: number;
}

const LABELS: Record<string, string> = {
  hadir: "Hadir",
  sakit: "Sakit",
  izin: "Izin",
  absen: "Absen",
};

export default function AttendanceDonutChart({ data, loading, totalDays }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    );
  }

  if (!data || data.every((d) => d.value === 0)) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
        Belum ada data presensi bulan ini
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <style>{`
        @keyframes sector-grow {
          from { transform: scale(1); }
          to { transform: scale(1.06); }
        }
        .sector-grow {
          animation: sector-grow 0.4s ease-out both;
          transform-origin: 50% 50%;
          transform-box: fill-box;
          outline: none !important;
        }
        .recharts-wrapper * {
          outline: none !important;
        }
        .recharts-wrapper *:focus,
        .recharts-wrapper *:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        .recharts-pie-sector:focus {
          outline: none !important;
        }
      `}</style>
      <div className="relative flex items-center justify-center" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height={300} className='z-10'>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
              onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              activeShape={({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }: any) => (
                <Sector
                  cx={cx}
                  cy={cy}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius + 8}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                  className="sector-grow"
                />
              )}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [
                `${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
                LABELS[name] || name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center pointer-events-none select-none">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">{totalDays ?? total}</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 tracking-wider">
            {totalDays !== undefined ? "Hari" : "Total"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-4">
        {data.map((entry) => {
          const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
          const tint = entry.color + "1a";
          return (
            <span
              key={entry.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: tint, color: entry.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {LABELS[entry.name] || entry.name}
              <span className="font-bold ml-auto">{pct}%</span>
            </span>
          );
        })}
      </div>
    </>
  );
}
