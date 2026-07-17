import { GraduationCap, FileText, UserPlus, Gamepad2, Music, LogIn } from "lucide-react";

export const navigationLinks: NavigateType[] = [
  { href: "/login", label: "Portal GTK", disabled: false, icon: LogIn },
  // { href: "/kelulusan", label: "Cek Kelulusan", disabled: true, icon: GraduationCap },
  // { href: "/hasil-tka", label: "Cek Hasil TKA", disabled: false, icon: FileText },
  // { href: "/pmb", label: "Daftar PMB", disabled: false, icon: UserPlus },
  { href: "/rekap-presensi", label: "Rekap Presensi", disabled: false, icon: FileText },
  { href: "/game-interaktif", label: "Game Interaktif", disabled: false, icon: Gamepad2 },
  // { href: "/tari-tarian", label: "Tari Tradisional", disabled: false, icon: Music },
];