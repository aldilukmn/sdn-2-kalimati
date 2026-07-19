"use client";

import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-blue-400/20 via-indigo-400/15 to-blue-500/20 dark:from-blue-500/15 dark:via-indigo-500/10 dark:to-blue-600/15" />
      <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 shadow-md md:backdrop-blur-md dark:border-slate-700/60 dark:bg-gray-800/80">
        <div className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-xl dark:from-blue-400/30 dark:to-indigo-400/30" />
              <img
                src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
                alt="Logo SDN 2 Kalimati"
                className="relative h-20 w-20 object-contain drop-shadow-sm"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
