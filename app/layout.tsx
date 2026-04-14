import type { Metadata } from "next";
import { Space_Grotesk, Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roshan | Motion-First Web Developer",
  description:
    "Interactive portfolio for Roshan, a web developer building motion-rich, editorial-style frontend experiences.",
  keywords: ["web developer", "portfolio", "creative developer", "frontend", "motion design", "next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} font-body antialiased`}>
        {children}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
