"use client";

import { Loader, CheckCircle2, AlertCircle } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  status?: "loading" | "success" | "error";
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

export default function LoadingModal({
  isOpen,
  title = "Memproses Pendaftaran",
  message = "Mohon tunggu, data Anda sedang diproses...",
  status = "loading",
  loadingText = "Jangan tutup halaman ini",
  successText = "Pendaftaran berhasil!",
  errorText = "Terjadi kesalahan",
}: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay dengan gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full transform transition-all duration-300">
          {/* Animated Border Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse" />

          {/* Content */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon Container with rotating animation */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              {status === "loading" && (
                <>
                  {/* Background animated circle */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-spin opacity-20" />
                  {/* Animated pulses */}
                  <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin" />
                  {/* Center icon */}
                  <Loader className="w-10 h-10 text-blue-600 dark:text-blue-400 relative z-10 animate-spin" />
                </>
              )}

              {status === "success" && (
                <div className="relative">
                  {/* Success background pulse */}
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-30" />
                  <CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400 relative z-10 animate-bounce" />
                </div>
              )}

              {status === "error" && (
                <div className="relative">
                  {/* Error background pulse */}
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse opacity-30" />
                  <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 relative z-10" />
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 animate-fade-in">
              {title}
            </h2>

            {/* Message dengan animasi fade-in */}
            <p className="text-gray-600 dark:text-gray-200 text-sm md:text-base leading-relaxed animate-pulse">
              {message}
            </p>

            {/* Progress indicator dots untuk loading */}
            {status === "loading" && (
              <div className="flex gap-2 justify-center mt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Additional info text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              {status === "loading" && loadingText}
              {status === "success" && successText}
              {status === "error" && errorText}
            </p>
          </div>

          {/* Optional: Animated bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-b-2xl opacity-50" />
        </div>
      </div>
    </div>
  );
}
