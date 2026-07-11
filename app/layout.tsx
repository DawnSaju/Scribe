import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/Cache";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import CookieContainer from "@/components/CookieContainer";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scribe",
  description: "Making every show a learning movement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.svg" sizes="any" type="image/svg+xml"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f3f3f3] font-['Inter',sans-serif] text-[#4b4b4b]`}
      >
        <ConvexAuthNextjsServerProvider>
          <QueryProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </QueryProvider>
          <CookieContainer/>
        </ConvexAuthNextjsServerProvider>
      </body>
      <SpeedInsights/>
    </html>
  );
}
