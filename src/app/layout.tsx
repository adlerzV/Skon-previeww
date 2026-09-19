import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const yekanFont = localFont({
  src: "./fonts/Yekan.woff",
  variable: "--font-yekan",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Arena2Battle — فروشگاه گیم",
  description: "خرید بازی، گیفت کارت و خدمات آنلاین گیمینگ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://api.arena2battle.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//api.arena2battle.com" />
      </head>
      <body className={`${yekanFont.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
