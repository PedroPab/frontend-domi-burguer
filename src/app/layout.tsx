import { Montserrat } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { Metadata } from "next";
import { metadataConfig } from "./metadata";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = metadataConfig

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-title" content="Domi Burguer" /></head>
      <script defer src="https://umami.toxolinko.site/script.js" data-website-id="6449fca5-1454-49e0-8bdc-33fba01bcda4"></script>
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
