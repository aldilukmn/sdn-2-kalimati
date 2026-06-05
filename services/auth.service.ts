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
    return await api("/logout", {
      method: "DELETE"
    });
  }
}