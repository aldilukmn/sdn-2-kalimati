import { API_URL } from "./constants";

export async function apiServer<T = any>(
  endpoint: string,
  token: string
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const err = new Error(`API Error: ${response.status}`) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  return response.json();
}
