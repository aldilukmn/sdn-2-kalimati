"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface MobileWidgetWrapperProps {
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  defaultExpanded?: boolean;
  actionRight?: ReactNode;
}

export default function MobileWidgetWrapper({
  title,
  icon,
  children,
  className = "",
  bodyClassName = "",
  defaultExpanded = false,
  actionRight,
}: MobileWidgetWrapperProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl flex flex-col overflow-hidden h-full ${className}`}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 md:p-5 flex items-center justify-between cursor-pointer md:cursor-default gap-3"
      >
        <div className="flex items-center gap-2 shrink-0">
          {icon && <div className="shrink-0">{icon}</div>}
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {title}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 flex-1 min-w-0">
          {actionRight && (
            <div onClick={(e) => e.stopPropagation()} className="hidden md:block flex-1 max-w-full">
              {actionRight}
            </div>
          )}
          <div className="md:hidden shrink-0">
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </div>
        </div>
      </div>
      
      <div className={`md:flex-1 grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr] md:grid-rows-[1fr]"}`}>
        <div className="overflow-hidden min-h-0 md:flex md:flex-col md:h-full">
          <div className={`px-4 pb-4 md:px-5 md:pb-5 md:pt-0 pt-0 flex-1 flex flex-col ${bodyClassName}`}>
            {actionRight && (
              <div className="md:hidden mb-4">
                {actionRight}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
