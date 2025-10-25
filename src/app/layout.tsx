import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
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
        className={montserrat.variable}
      >
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
      </body>
    </html>
  );
}
