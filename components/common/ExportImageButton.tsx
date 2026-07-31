"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";
import { MONTHS_ID } from "@/lib/format";

interface Props {
  month: number;
  year: number;
  grade: number;
  posterRef: React.RefObject<HTMLElement | null>;
}

export default function ExportImageButton({ month, year, grade, posterRef }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!posterRef.current) return;
    try {
      setExporting(true);
      
      // We use html-to-image to convert the DOM node to PNG
      // We need to wait a tiny bit to ensure fonts/icons are fully rendered
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        backgroundColor: '#f8fafc', // slate-50
        pixelRatio: 2, // High resolution
        style: {
          opacity: '1', // Override the 0.001 opacity used to hide it
          transform: 'none',
        }
      });
      
      const monthName = MONTHS_ID[month - 1];
      const filename = `Rekap_Presensi_Kelas_${grade}_${monthName}_${year}.png`;
      
      // Create fake link and trigger download
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
      
    } catch (err) {
      console.error("Gagal membuat gambar:", err);
      alert("Terjadi kesalahan saat membuat gambar. Silakan coba lagi.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {exporting ? (
        <span className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      ) : (
        <ImageIcon size={16} />
      )}
      {exporting ? "Membuat Gambar..." : "Unduh Gambar Rekap"}
    </button>
  );
}
