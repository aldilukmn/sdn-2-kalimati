import { cookies } from "next/headers";
import DashboardClient from "./client";

function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
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

  const initialMonth = new Date().getMonth() + 1;
  const initialYear = new Date().getFullYear();

  return (
    <DashboardClient
      userRole={userRole}
      userName={userName}
      userGrade={userGrade}
      initialMonth={initialMonth}
      initialYear={initialYear}
    />
  );
}
