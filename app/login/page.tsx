"use client";

import { FormEvent, useState } from "react";
import AuthService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import BackButton from "../components/BackButton";
import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await AuthService.login(identifier, password);

      setStatus("success");
      setMessage(response.status.message);

      const token = response.result?.token || response.result;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || "admin";
      const grade = payload.grade || "";
      const fullName = payload.fullName || identifier;

      sessionStorage.setItem("user_session", token);
      sessionStorage.setItem("user_identifier", identifier);
      sessionStorage.setItem("user_fullName", fullName);
      sessionStorage.setItem("user_role", role);
      sessionStorage.setItem("user_grade", grade);
      document.cookie = `user_session=${token}; path=/; max-age=86400`;

      if (role === "guru") {
        router.push("/dashboard");
      } else if (role === "penjaga") {
        router.push("/beranda-penjaga");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setStatus("error");

      setMessage(error instanceof Error ? error.message : "Login gagal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-5 md:gap-10 px-5 py-7 xl:py-10 min-h-screen overflow-hidden">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/10 blur-3xl dark:from-blue-500/20 dark:to-indigo-500/10" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/10 blur-3xl dark:from-indigo-500/20 dark:to-blue-500/10" />
      <div className="absolute top-1/3 right-10 h-40 w-40 rounded-full bg-purple-400/10 blur-2xl dark:bg-purple-500/10" />
      <div className="absolute bottom-1/3 left-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl dark:bg-cyan-500/10" />

      <div className="relative z-10 flex w-full flex-col items-center gap-5 md:gap-10">
        <div className="self-start">
          <BackButton />
        </div>
        <AuthCard
        title="Selamat Datang"
        subtitle="Gunakan Username dan Password Anda untuk masuk."
          status={status}
          message={message}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="Masukkan Username"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan Password"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-10 pr-10 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:from-blue-700 hover:to-indigo-700 focus:outline-none ${
                submitting || !identifier || !password
                  ? "opacity-50 disabled:cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={submitting || !identifier || !password}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              )}
              <span>{submitting ? "Memproses..." : "Masuk"}</span>
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
