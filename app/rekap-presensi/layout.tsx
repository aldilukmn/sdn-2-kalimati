import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekap Presensi Siswa - SDN 2 Kalimati",
  description: "Rekap presensi siswa harian",
};

export default function RekapPresensiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
