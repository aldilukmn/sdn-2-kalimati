import { api } from "@/lib/api";

export default class AuthService {
  static async login(
    username: string,
    password: string
  ) {
    return await api("/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    });
  }

  static async logout() {
    const token = typeof window !== "undefined"
      ? sessionStorage.getItem("user_session")
      : null;
    const username = typeof window !== "undefined"
      ? sessionStorage.getItem("user_identifier")
      : null;

    if (!token || !username) {
      throw new Error("Token or username not found");
    }

    return await api("/logout", {
      method: "POST",
      body: JSON.stringify({
        token,
        username
      })
    });
  }
}