import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TrackerProvider } from "@/context/TrackerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Martabak Mantab - Sales & Capital Cycle Tracker",
  description: "Monitor titik impas belanja modal dan catat omzet harian multi-channel Martabak Mantab.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Martabak Mantab",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#050505] text-white flex justify-center">
        <TrackerProvider>
          <div className="w-full max-w-[440px] min-h-screen bg-[#0D0D0D] text-white flex flex-col relative border-x border-[#1A1A1C]/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] pb-24">
            {children}
          </div>
        </TrackerProvider>
      </body>
    </html>
  );
}
