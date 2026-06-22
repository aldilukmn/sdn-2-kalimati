import { API_URL } from "./constants";

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(^| )${name}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export const api = async (
  endpoint: string,
  options: RequestInit = {}
) => {
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

  let result: any;
  
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
    const error = new Error(
      result?.status?.message || result?.message || `HTTP ${response.status}`
    ) as Error & {
      status?: number;
    };

    error.status = response.status;

    throw error;
  }

  return result;
};