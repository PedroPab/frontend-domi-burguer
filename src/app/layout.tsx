import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DomiBurguer, ¡pídela ya!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <HeroUIProvider>
            <ToastProvider
              placement="top-right"
              toastOffset={100}
              maxVisibleToasts={10}
            />
            <div className="container mx-auto overflow-x-hidden px-5 sm:px-10 md:px-10 lg:px-10 xl:px-16  max-w-[1440px] h-auto">
              {children}
            </div>
          </HeroUIProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
