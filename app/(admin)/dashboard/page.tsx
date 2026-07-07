import { cookies } from "next/headers";
import DashboardClient from "./client";
import { decodeJWT } from "@/lib/jwt";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_session")?.value;

  let userRole: string | null = null;
  let userName: string | null = null;
  let userGrade: string | null = null;
  let isSavingsHolder = false;

  if (token) {
    const payload = decodeJWT(token);
    if (payload) {
      userRole = payload.role || null;
      userName = payload.fullName || null;
      userGrade = payload.grade || null;
      isSavingsHolder = payload.savingsHolder === true;
    }
  }

  const initialMonth = new Date().getMonth() + 1;
  const initialYear = new Date().getFullYear();

  return (
    <DashboardClient
      userRole={userRole}
      userName={userName}
      userGrade={userGrade}
      isSavingsHolder={isSavingsHolder}
      initialMonth={initialMonth}
      initialYear={initialYear}
    />
  );
}
