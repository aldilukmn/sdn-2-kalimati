"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40  z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full border border-white/20 dark:border-gray-700/50 p-5 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title !== undefined && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100">{title}</h3>
            <button
              ref={closeRef}
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
