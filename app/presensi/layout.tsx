import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presensi Siswa - SDN 2 Kalimati",
  description: "Input presensi siswa harian",
};

export default function PresensiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
