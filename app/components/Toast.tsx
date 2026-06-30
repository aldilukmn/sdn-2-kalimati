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

  const borderColor =
    type === "success" ? "border-l-emerald-500" : "border-l-red-500";
  const bgColor =
    type === "success" ? "bg-emerald-50 dark:bg-gray-800" : "bg-red-50 dark:bg-gray-800";
  const textColor =
    type === "success"
      ? "text-emerald-800 dark:text-emerald-200"
      : "text-red-800 dark:text-red-200";

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 border-l-4 ${borderColor} ${bgColor} ${textColor} px-4 py-3 rounded-r-lg shadow-lg animate-slide-in-right max-w-sm`}
    >
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
}
