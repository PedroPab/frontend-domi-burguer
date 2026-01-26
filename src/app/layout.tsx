import { Montserrat } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
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
      <script defer src="https://umami.toxolinko.site/script.js" data-website-id="eae720e3-134b-4d76-a2fd-1d74b32bbcca"></script>
      <body
        className={montserrat.variable}
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
