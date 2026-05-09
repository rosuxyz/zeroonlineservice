import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Zero topuphub – Premium Game Top-Ups",
  description:
    "Zero topuphub is your ultimate source for instant, secure, and reliable game top-ups for Free Fire, PUBG Mobile, Valorant, and more.",
  keywords: ["game top-up", "free fire", "pubg mobile", "valorant points", "gaming", "Nepal"],
  authors: [{ name: "Zero topuphub" }],
  openGraph: {
    title: "Zero topuphub – Premium Game Top-Ups",
    description: "Instant, secure, and reliable game top-ups.",
    url: "https://topuphub.com",
    siteName: "Zero topuphub",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} data-scroll-behavior="smooth">
      <body className={`${outfit.className} bg-background text-foreground antialiased overflow-x-hidden`}>
        <AuthProvider>
          {children}
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
