import type { ApiResponse } from "@/types/api";
import { API_URL } from "./constants";

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(^| )${name}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export const api = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token =
    typeof window !== "undefined"
      ? (sessionStorage.getItem(
          "user_session"
        ) || getCookie("user_session"))
      : null;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: token
          ? `Bearer ${token}`
          : "",
        "Content-Type": "application/json",
        ...options.headers
      }
    }
  );

  let result: ApiResponse<T>;

  try {
    result = await response.json();
  } catch (err) {
    const responseText = await response.clone().text();
    console.error("Response text:", responseText);
    const error = new Error(
      `API Error: ${response.status} ${response.statusText}`
    ) as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem("user_session");
      document.cookie = "user_session=; max-age=0; path=/";
      window.location.href = "/login";
      throw new Error("Sesi berakhir, silakan login ulang");
    }

    const error = new Error(
      result?.status?.message || (result as any)?.message || `HTTP ${response.status}`
    ) as Error & {
      status?: number;
    };

    error.status = response.status;

    throw error;
  }

  return result;
};