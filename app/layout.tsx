import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import ThemeProvider from "./theme-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SDN 2 Kalimati",
  description:
    "Aplikasi Informasi UPTD SD Negeri 2 Kalimati Kecamatan Jatibarang Kabupaten Indramayu",
  icons: {
    icon: "https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg",
  },
  openGraph: {
    title: "SDN 2 Kalimati",
    description:
      "Website UPTD SD Negeri 2 Kalimati Kecamatan Jatibarang Kabupaten Indramayu",
    url: "https://sdn2kalimati.vercel.app",
    siteName: "SDN 2 Kalimati",
    images: [
      {
        url: "https://sdn2kalimati.vercel.app/logo-2-kalimati.png",
        width: 200,
        height: 150,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("sdn2-theme");if(!t){t=matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
        <link
          rel="icon"
          href="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
        />
      </head>
      <body
        className={`${poppins.className} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "16px",
                padding: "12px 16px",
                fontSize: "13px",
                fontWeight: 500,
                pointerEvents: "none",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#fff" },
              },
            }}
          />
          <ThemeProvider>
            {/* Background dipisah ke layer fixed agar scroll lebih smooth */}
            <div
              className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.1),transparent_35%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_45%,#dbeafe_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_35%),linear-gradient(180deg,#0f172a_0%,#111827_45%,#1e293b_100%)]"
            />
            <div className="relative z-0 min-h-screen">
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
