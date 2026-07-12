import type { ApiResponse } from "@/types/api";
import { API_URL } from "./constants";

export async function apiServer<T = any>(
  endpoint: string,
  token: string
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  let result: ApiResponse<T>;

  try {
    result = await response.json();
  } catch {
    const error = new Error(
      `API Error: ${response.status} ${response.statusText}`
    ) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(
      result?.status?.message || `HTTP ${response.status}`
    ) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return result;
}
