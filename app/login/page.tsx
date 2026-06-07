"use client";

import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import AuthService from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await AuthService.login(identifier, password);

      setStatus("success");
      setMessage(response.status.message);

      // Set token to both sessionStorage and cookie
      sessionStorage.setItem("user_session", response.result);
      sessionStorage.setItem("user_identifier", identifier);
      document.cookie = `user_session=${response.result}; path=/; max-age=86400`;

      router.push("/dashboard");
    } catch (error) {
      setStatus("error");

      setMessage(error instanceof Error ? error.message : "Login gagal");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 md:gap-10 px-5 my-5 xl:my-10">
      <Link
        href="/"
        className="self-start mb-5 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <button className="cursor-pointer flex items-center gap-1 border px-4 py-2 rounded-lg text-sm bg-blue-500 hover:bg-blue-600 duration-300 text-white dark:bg-blue-800 dark:hover:bg-blue-700 dark:border-blue-800/50 border-blue-500/50">
          <ArrowBigLeft size={18} />
          <span className="text-xs md:text-sm">Kembali</span>
        </button>
      </Link>
      <div className="w-full max-w-lg rounded-[32px] border border-slate-200/60 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/90">
        <div className="mb-8 text-center">
          <img
            src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
            alt="Logo SDN 2 Kalimati"
            className="mx-auto mb-6 h-20 w-20 object-contain"
          />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Masuk ke Admin
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Gunakan Username dan Password Anda untuk masuk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Username
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Masukkan Username"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan Password"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
          >
            Masuk
          </button>
        </form>

        {status !== "idle" && (
          <div
            className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
              status === "success"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200"
            }`}
          >
            {message}
          </div>
        )}
        {/* 
        <div className="mt-8 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 transition duration-200 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:hover:text-blue-300"
          >
            Kembali ke Beranda
          </Link>
          <span>Butuh bantuan? Hubungi admin sekolah.</span>
        </div> */}
      </div>
    </div>
  );
}
