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
      link.download = `PMB26-SD-${String(count || 0).padStart(3, "0")}`;
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
              Bukti Pendaftaran PMB
            </p>
          </div>
        </div>

        <div className="space-y-5 relative z-10">
          <div className="bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
            <p className="text-blue-200 text-[10px] mb-1 uppercase tracking-widest font-semibold">
              Nomor Pendaftaran
            </p>
            <p className="text-2xl font-mono font-bold tracking-widest text-white">
              PMB26-SD-{String(count || 0).padStart(3, "0")}
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
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        <div className="flex col-span-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center cursor-pointer text-sm transition duration-200 dark:bg-green-600 dark:hover:bg-green-500 dark:border-green-500 gap-2"
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
            <span>Download Kartu</span>
          </button>
          <a
            href="https://chat.whatsapp.com/HRiuyozG56e7z9KA7XmC4L?s=cl&p=a&mlu=3&amv=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center cursor-pointer text-sm transition duration-200 dark:bg-green-600 dark:hover:bg-green-500 dark:border-green-500 gap-2 "
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Gabung Grup WA
          </a>
        </div>
        <Link
          id="back-to-home"
          href="/"
          className="w-full col-span-2 font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-center text-sm bg-gray-100 hover:bg-gray-200 transition duration-200 border border-gray-300 cursor-pointer text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:border-gray-600 dark:text-gray-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
