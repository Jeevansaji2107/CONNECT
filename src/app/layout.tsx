import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { NotificationListener } from "@/components/shared/NotificationListener";
import { auth } from "@/auth";
import { BackgroundEngine } from "@/components/shared/BackgroundEngine";
import { SilenceModeWrapper } from "@/components/wellbeing/SilenceModeWrapper";
import { ViewportHUD } from "@/components/shared/ViewportHUD";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connect | The Premium Social Web",
  description: "Experience the next generation of social connectivity with Connect.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("Session fetch failed:", e);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          <SilenceModeWrapper />
          <BackgroundEngine />
          <ViewportHUD />
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Toaster position="bottom-center" richColors theme="dark" />
          <NotificationListener />
        </SessionProvider>
      </body>
    </html>
  );
}
