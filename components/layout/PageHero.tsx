"use client";

import { type LucideIcon } from "lucide-react";

interface PageHeroProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  subtitle?: string;
  iconSize?: "default" | "large";
  className?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  icon: Icon,
  title,
  description,
  subtitle,
  iconSize = "default",
  className,
  children,
}: PageHeroProps) {
  const large = iconSize === "large";

  return (
    <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
      <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
      <div
        className={`relative p-5 md:p-6 flex items-center gap-4 ${children ? "justify-between" : ""} ${className || ""}`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`shrink-0 ${
              large
                ? "w-14 h-14 md:w-16 md:h-16 backdrop-blur-sm"
                : "w-12 h-12 md:w-14 md:h-14"
            } bg-white/15 rounded-xl flex items-center justify-center animate-iconBounce`}
            aria-hidden="true"
          >
            <Icon
              size={large ? 28 : 26}
              className={`${large ? "md:size-[32px]" : "md:size-[30px]"} text-white`}
              aria-hidden="true"
            />
          </div>
          <div className={large ? "min-w-0" : ""}>
            {subtitle && (
              <p className="text-indigo-200/80 text-xs md:text-sm font-medium tracking-wide">
                {subtitle}
              </p>
            )}
            <h1
              className={`text-white text-sm md:text-xl font-bold ${large ? "truncate" : ""}`}
            >
              {title}
            </h1>
            {description && (
              <p className="text-indigo-200/80 text-xs md:text-sm mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
