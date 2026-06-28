import type { Metadata } from "next";
import DashboardShell from "@/app/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard Admin - SDN 2 Kalimati",
  description: "Dashboard admin untuk mengelola data sekolah",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
