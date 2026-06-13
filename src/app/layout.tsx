import type { Metadata } from "next";
import "./globals.css";
import { PwaRegister } from "./pwa-register";
import { CookieBanner } from "@/src/components/ui/cookie-banner";

export const metadata: Metadata = {
  title: "Preservando Memórias",
  description:
    "Memorial digital com QR Code para preservar memórias de entes queridos.",
  applicationName: "Preservando Memórias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
