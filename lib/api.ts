import { API_URL } from "./constants";

export const api = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem(
          "user_session"
        )
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

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result?.status?.message
    ) as Error & {
      status?: number;
    };

    error.status = response.status;

    throw error;
  }

  return result;
};