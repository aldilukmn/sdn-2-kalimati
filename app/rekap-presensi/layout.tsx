import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekap Presensi Murid - SDN 2 Kalimati",
  description: "Rekap presensi murid harian",
};

export default function RekapPresensiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
