"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp } from "lucide-react";
import RegistrationService from "@/services/registration.service";

export default function RegistrationCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        const response = await RegistrationService.totalRegistrations();
        const total = response.result?.total as number;
        setCount(total);
      } catch (error) {
        console.error("Error fetching registration count:", error);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();

    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 shadow-lg">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative px-6 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side - Icon & Text */}
          <div className="flex items-center gap-4 md:gap-6 flex-1">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 ">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            </div>

            <div>
              <p className="text-sm md:text-base font-medium text-blue-100 mb-1">
                Jumlah Pendaftar
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {isLoading ? (
                  <span className="inline-block w-12 h-8 bg-blue-400/30 rounded animate-pulse" />
                ) : (
                  `${count?.toLocaleString("id-ID")} ${count === 1 ? "Murid" : "Murid"}`
                )}
              </p>
            </div>
          </div>

          {/* Right Side - Status Badge */}
          <div className="flex items-center gap-2 bg-white/10  px-4 md:px-6 py-3 rounded-full">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-medium text-white">
                {isLoading ? "Memuat..." : "Data Real-time"}
              </span>
            </div>
            <TrendingUp className="w-4 h-4 text-green-300" />
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="h-1 bg-gradient-to-r from-blue-400 via-transparent to-blue-400" />
      </div>
    </div>
  );
}
