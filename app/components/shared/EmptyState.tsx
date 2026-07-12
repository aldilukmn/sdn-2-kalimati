"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 ${className}`}>
      <div className="text-center py-12">
        {Icon && (
          <Icon size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" aria-hidden="true" />
        )}
        <p className="text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        {description && (
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{description}</p>
        )}
        {action && (
          <div className="mt-4">
            {action.href ? (
              <Link
                href={action.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
