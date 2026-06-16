import { GraduationCap, FileText, UserPlus, Gamepad2 } from "lucide-react";

export const navigationLinks: NavigateType[] = [
  { href: "/kelulusan", label: "Cek Kelulusan", disabled: true, icon: GraduationCap },
  { href: "/hasil-tka", label: "Cek Hasil TKA", disabled: false, icon: FileText },
  { href: "/spmb", label: "Daftar SPMB", disabled: false, icon: UserPlus },
  { href: "/game-interaktif", label: "Game Interaktif", disabled: false, icon: Gamepad2 },
];