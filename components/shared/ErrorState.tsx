"use client";

import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string | null;
  onRetry?: () => void;
  variant?: "danger" | "warning";
}

export default function ErrorState({ error, onRetry, variant = "danger" }: ErrorStateProps) {
  if (!error) return null;

  const isDanger = variant === "danger";

  return (
    <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
      <div className="text-center py-12">
        <AlertCircle
          size={40}
          className={`mx-auto mb-3 ${isDanger ? "text-red-300 dark:text-red-600" : "text-amber-300 dark:text-amber-600"}`}
          aria-hidden="true"
        />
        <p className={`font-medium ${isDanger ? "text-red-500 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  );
}
