import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import AuthRefresher from "@/components/account/AuthRefresher";
import TopLoader from "@/components/ui/TopLoader";

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
        <link rel="dns-prefetch" href="https://api.arena2battle.com" />
      </head>
      <body className={`${yekanFont.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <ToastProvider>
          <Suspense fallback={null}>
            <CartProvider>
              <AuthRefresher />
              {children}
            </CartProvider>
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}