import type { Metadata } from "next";
import { cookies } from "next/headers";
import DashboardShell from "@/app/dashboard/DashboardShell";
import { decodeJWT } from "@/lib/jwt";

export const metadata: Metadata = {
  title: "Dashboard Admin - SDN 2 Kalimati",
  description: "Dashboard admin untuk mengelola data sekolah",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_session")?.value;

  let userRole: string | null = null;
  let userName: string | null = null;
  let userGrade: string | null = null;

  if (token) {
    const payload = decodeJWT(token);
    if (payload) {
      userRole = payload.role || null;
      userName = payload.fullName || null;
      userGrade = payload.grade || null;
    }
  }

  return (
    <DashboardShell userRole={userRole} userName={userName} userGrade={userGrade}>
      {children}
    </DashboardShell>
  );
}
