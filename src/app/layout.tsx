import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const yekanFont = localFont({
  src: "./fonts/Yekan.woff2",
  variable: "--font-yekan",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arena2battle.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arena2Battle — فروشگاه گیم",
    template: "%s | Arena2Battle",
  },
  description: "خرید بازی، گیفت کارت و خدمات آنلاین گیمینگ",
  applicationName: "Arena2Battle",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "Arena2Battle",
    title: "Arena2Battle — فروشگاه گیم",
    description: "خرید بازی، گیفت کارت و خدمات آنلاین گیمینگ",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <body className={`${yekanFont.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
