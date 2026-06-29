"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface Props {
  data: { grade: string; rate: number; studentCount: number }[];
  loading?: boolean;
}

const GRADE_COLORS: Record<string, string> = {
  "1": "#fb7185",
  "2": "#fbbf24",
  "3": "#a3e635",
  "4": "#22d3ee",
  "5": "#818cf8",
  "6": "#e879f9",
};

const SKELETON_HEIGHTS = ["55", "70", "48", "82", "63", "76"];

const RECHARTS_PROPS = new Set([
  "parentViewBox",
  "originalDataIndex",
  "background",
  "payload",
  "tabIndex",
  "formattedValue",
  "xAxis",
  "yAxis",
  "stackedBarStart",
  "stackedBarEnd",
  "tooltipPosition",
  "studentCount",
  "isActive",
  "dataKey",
  "animationElapsedTime",
  "isAnimating",
  "isEntrance",
]);

function sanitizeDOMProps(obj: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (!RECHARTS_PROPS.has(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export default function AttendanceBarChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="h-[300px] flex items-end justify-center gap-3 px-8 ">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse"
            style={{ height: `${SKELETON_HEIGHTS[i]}%` }}
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
        Belum ada data presensi bulan ini
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes bar-grow {
          from { transform: scaleY(1); }
          to { transform: scaleY(1.08); }
        }
        .bar-grow {
          animation: bar-grow 0.4s ease-out both;
          transform-origin: bottom;
          transform-box: fill-box;
        }
      `}</style>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <XAxis
            dataKey="grade"
            tickFormatter={(v) => `Kelas ${v}`}
            tick={{ fontSize: 13, fontWeight: 500, className: "fill-gray-600 dark:fill-gray-200" }}
            axisLine={{ className: "stroke-gray-500 dark:stroke-gray-200" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 12, className: "fill-gray-600 dark:fill-gray-200" }}
            axisLine={{ className: "stroke-gray-500 dark:stroke-gray-200" }}
            tickLine={false}
          />
          <Tooltip
            cursor={false}
            formatter={(value: any) => [`${value}%`, "Kehadiran"]}
            labelFormatter={(label: any) => `Kelas ${label}`}
          />
          <Bar
            dataKey="rate"
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
            key={`bars-${data.map(d => d.rate).join("-")}`}
            activeBar={({ x, y, width, height, ...rest }: any) => {
              const ny = y - height * 0.08;
              const nh = height * 1.08;
              const nb = ny + nh;
              const r = 8;
              return (
                <path
                  d={`M ${x} ${nb} L ${x} ${ny + r} Q ${x} ${ny} ${x + r} ${ny} L ${x + width - r} ${ny} Q ${x + width} ${ny} ${x + width} ${ny + r} L ${x + width} ${nb} Z`}
                  className="bar-grow"
                  {...sanitizeDOMProps(rest)}
                />
              );
            }}
            label={{
              position: "center",
              content: ({ x, y, width, height, index }: any) => {
                const sCount = data[index]?.studentCount;
                if (!sCount) return null;
                const cx = x + width / 2;
                const cy = y + height / 2;
                return (
                  <g>
                    <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
                      {sCount}
                    </text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fill="#ffffffcc" fontSize={12} fontWeight={500}>
                      Murid
                    </text>
                  </g>
                );
              },
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={GRADE_COLORS[entry.grade] || "#6366f1"}
              />
            ))}
            <LabelList
              dataKey="rate"
              position="top"
              formatter={(v: any) => `${v}%`}
              className="fill-gray-900 dark:fill-gray-100"
              style={{ fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
