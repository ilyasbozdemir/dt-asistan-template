import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DT Asistan Template Engine",
  description: "DT Asistan dinamik belge şablon motoru ve çıktı merkezi.",
  icons: {
    icon:
      "https://raw.githubusercontent.com/ilyasbozdemir/dt-asistan-app/main/apps/app-desktop/resources/icon.png",
    apple:
      "https://raw.githubusercontent.com/ilyasbozdemir/dt-asistan-app/main/apps/app-desktop/resources/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}
