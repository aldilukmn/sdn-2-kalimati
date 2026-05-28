interface DataFieldProps {
  label: string;
  value: string | number;
  grade?: string;
}

export default function DataField({ label, value, grade }: DataFieldProps) {
  return (
    <div className="rounded-2xl bg-blue-500/5 dark:bg-white/5 border border-blue-500/50 dark:border-white/5 p-4">
      <p className="text-sm opacity-60 mb-1">{label}</p>

      <h3 className="font-semibold text-base md:text-lg">
        {value}

        {grade && (
          <span className="text-sm text-yellow-400 ml-2">({grade})</span>
        )}
      </h3>
    </div>
  );
}
