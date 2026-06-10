"use client";

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import Link from 'next/link';
import RegistrationService from '@/services/registration.service';


export default function RegistrationCard({name}: {name: string}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
      const fetchCount = async () => {
        try {
          setIsLoading(true);
          const response = await RegistrationService.totalRegistrations();
          const total = response.result?.total as number;
          setCount(total);
        } catch (error) {
          if (error instanceof Error) { 
            console.error("Error fetching registration count:", error);
          }
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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      // html-to-image usually handles modern CSS (like gradients and blurs) better than html2canvas
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2 // For higher resolution
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `SPMB26-SD-${String(count || 0).padStart(3, "0")}`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert(`Gagal mengunduh gambar: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
      {/* The Card Element to be captured */}
      <div
        ref={cardRef}
        className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-blue-400/30"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        <div className="flex items-center gap-4 border-b border-white/20 pb-4 mb-5">
          <img
            src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
            alt="Logo SDN 2 Kalimati"
            className="h-15 w-20 object-contain"
          />
          <div>
            <h3 className="font-bold text-lg leading-tight">
              UPTD SDN 2 Kalimati
            </h3>
            <p className="text-blue-200 text-xs font-medium tracking-wide">
              Bukti Pendaftaran SPMB
            </p>
          </div>
        </div>

        <div className="space-y-5 relative z-10">
          <div className="bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
            <p className="text-blue-200 text-[10px] mb-1 uppercase tracking-widest font-semibold">
              Nomor Pendaftaran
            </p>
            <p className="text-2xl font-mono font-bold tracking-widest text-white">
              SPMB26-SD-{String(count || 0).padStart(3, "0")}
            </p>
          </div>

          <div className="px-1">
            <p className="text-blue-200 text-[10px] mb-1 uppercase tracking-widest font-semibold">
              Nama Calon Siswa
            </p>
            <p className="text-xl font-bold capitalize leading-snug">{name}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 text-center">
          <p className="text-[11px] text-blue-100 opacity-90 font-medium">
            Harap simpan kartu ini sebagai bukti bahwa Anda telah terdaftar.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-4">
        <button
          onClick={handleDownload}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-green-400/50 cursor-pointer text-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Kartu
        </button>
        <Link
          id="back-to-home"
          href="/"
          className="flex-1 font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border text-center text-sm"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
