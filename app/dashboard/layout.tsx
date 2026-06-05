import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin - SDN 2 Kalimati",
  description: "Dashboard admin untuk mengelola data pendaftar online",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
