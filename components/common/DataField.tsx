interface DataFieldProps {
  label: string;
  value: string | number;
  grade?: string;
}

const gradeColors: Record<string, string> = {
  "Sangat Baik": "text-blue-400",
  Baik: "text-green-400",
  Memadai: "text-yellow-400",
  Kurang: "text-red-400",
};

export default function DataField({ label, value, grade }: DataFieldProps) {
  const gradeColor = gradeColors[grade || ""] || "text-slate-500";

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-white to-indigo-50/80 dark:from-slate-800/90 dark:to-indigo-900/30 border border-indigo-100 dark:border-indigo-500/20 p-4 shadow-sm hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-400/50 transition-all duration-300 hover:-translate-y-1">
      {/* Decorative blurred glow */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-linear-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out" />
      
      <div className="relative z-10">
        <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
          {label}
        </p>

        <h3 className="font-extrabold text-base md:text-lg text-slate-800 dark:text-white flex items-center flex-wrap gap-2">
          {value}

          {grade && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-current shadow-sm ml-1 ${gradeColor}`}>
              {grade}
            </span>
          )}
        </h3>
      </div>
    </div>
  );
}
