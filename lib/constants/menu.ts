import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  Users,
  Wallet,
  BookOpen,
  ClipboardEdit,
  ScrollText,
  Scale,
  Calculator,
  BarChart3,
  GraduationCap,
  ListChecks,
  UserCog,
  PieChart,
  FileEdit,
  NotebookPen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MenuItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

export type MenuGroup = {
  label: string;
  icon: LucideIcon;
  children: MenuItem[];
};

export type SidebarItem = MenuItem | MenuGroup;

export const menuItems: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "Presensi",
    icon: CalendarCheck,
    children: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard-presensi" },
      { label: "Input Presensi", icon: CalendarCheck, href: "/presensi-murid" },
    ],
  },
  { label: "Tabungan Murid", icon: Wallet, href: "/tabungan-murid" },
  { label: "Catatan", icon: NotebookPen, href: "/catatan" },
  { label: "Daftar Mapel", icon: BookOpen, href: "/daftar-mapel" },
  {
    label: "Nilai Akademik",
    icon: GraduationCap,
    children: [
      { label: "Nilai Harian", icon: ClipboardEdit, href: "/nilai-harian" },
      {
        label: "Rekap Nilai Harian",
        icon: ScrollText,
        href: "/rekap-nilai-harian",
      },
      { label: "Penilaian", icon: FileEdit, href: "/penilaian" },
      
      { label: "Nilai LitNum", icon: PieChart, href: "/nilai-litnum" },
      { label: "Komponen Nilai", icon: ClipboardList, href: "/komponen-nilai" },
      { label: "Nilai Akhir", icon: Calculator, href: "/nilai-akhir" },
      {
        label: "Rekap Nilai Akhir",
        icon: BarChart3,
        href: "/rekap-nilai-akhir",
      },
      { label: "Konfigurasi Nilai", icon: Scale, href: "/konfigurasi-nilai" },
    ],
  },
  {
    label: "Nilai Karakter",
    icon: ListChecks,
    children: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard-karakter",
      },
      { label: "Penilaian", icon: ClipboardEdit, href: "/penilaian-karakter" },
      { label: "Rekapitulasi", icon: ClipboardList, href: "/rekap-karakter" },
      { label: "Konfigurasi KAIH", icon: Scale, href: "/konfigurasi-kaih" },
    ],
  },
  { label: "Data Murid", icon: Users, href: "/data-murid" },
  { label: "Data GTK", icon: Users, href: "/data-gtk" },
  { label: "Data Pendaftar", icon: ClipboardList, href: "/data-pendaftar" },
  { label: "Profil Saya", icon: UserCog, href: "/profil" },
];

export const penjagaMenuItems = [
  { label: "Beranda", icon: LayoutDashboard, href: "/beranda-penjaga" },
];

export const guruAllowedHrefs = new Set([
  "/dashboard",
  "/dashboard-karakter",
  "/dashboard-presensi",
  "/penilaian-karakter",
  "/rekap-karakter",
  "/nilai-harian",
  "/penilaian",
  "/nilai-litnum",
  "/komponen-nilai",
  "/rekap-nilai-harian",
  "/rekap-nilai-akhir",
  "/nilai-akhir",
  "/daftar-mapel",
  "/presensi-murid",
  "/tabungan-murid",
  "/data-murid",
  "/profil",
  "/catatan",
]);
