"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === "success";
  const borderColor = isSuccess ? "border-emerald-500/40 dark:border-emerald-500/30" : "border-red-500/40 dark:border-red-500/30";
  const barColor = isSuccess ? "bg-emerald-400/70" : "bg-red-400/70";
  const textColor = isSuccess
    ? "text-emerald-800 dark:text-emerald-200"
    : "text-red-800 dark:text-red-200";

  return (
    <div
      className={`fixed top-4 right-4 w-[66vw] md:w-auto z-50 flex flex-col border ${borderColor} bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl ${textColor} rounded-2xl shadow-lg animate-slide-in-right md:max-w-sm overflow-hidden`}
    >
      <div className="flex items-center gap-3 px-4 pt-3 pb-2.5">
        <p className="text-xs md:text-sm font-medium flex-1 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
      <div
        className={`h-[2px] ${barColor} rounded-full animate-shrink`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}
