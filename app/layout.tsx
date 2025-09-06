import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "SDN 2 Kalimati",
  description: "Aplikasi Informasi UPTD SD Negeri 2 Kalimati Kecamatan Jatibarang Kabupaten Indramayu",
  icons: {
    icon: "https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg" />
      </head>
      <body
        className={`${poppins} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
