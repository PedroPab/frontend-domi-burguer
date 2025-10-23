import React from "react";
import { Button } from "@/components/ui/button";
import {
  LogoDesktopWhite,
  WhatsAppIcon,
  TiktokIcon,
  InstagramIcon,
  EmailIcon,
} from "./ui/icons";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const navigationLinks = [
    { name: "COBERTURA", link: "/cobertura" },
    { name: "MENU", link: "/#products" },
    { name: "HORARIOS", link: "/horarios" }
  ];

  const legalLinks = [
    { name: "TÉRMINOS DE SERVICIO", link: "/legal#terminos" },
    { name: "POLÍTICAS DE PRIVACIDAD", link: "/legal#politicas" }
  ];

  return (
    <footer className="flex flex-col w-full items-start relative text-accent-yellow-10">
      <Image
        className="relative self-stretch w-full hidden md:block"
        alt="Sec"
        src="/footerDesktop.png"
        width={1920}
        height={500}
        priority
      />
      <Image
        className="relative self-stretch w-full md:hidden"
        alt="Sec"
        src="/footerMobile.png"
        width={500}
        height={700}
        priority
      />
      <div className=" lg:items-start relative flex flex-col lg:flex-row justify-between px-6 py-16 lg:p-16 lg:px-10 lg:space-x-3 lg:20 self-stretch w-full bg-primary-red border-b border-solid border-[#fff9e6] h-[522px] lg:h-auto">
        <div className="relative lg:w-[170px] h-[90px] flex items-center justify-center w-full">
          <LogoDesktopWhite
            width={170}
            height={90}
            className="min-h-20 min-w-40"
          />
        </div>

        <nav className="inline-flex flex-col items-start gap-2 relative">
          {navigationLinks.map((link) => (
            <Link
              key={link.link}
              href={link.link}
              className={`relative self-stretch font-semibold text-accentmikado-10 text-lg tracking-[0] leading-6 h-auto p-0 hover:bg-transparent`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <nav className="inline-flex flex-col items-end gap-2 relative">
          {legalLinks.map((legal) => (
            <Link
              key={legal.link}
              href={legal.link}
              className={`relative self-stretch font-semibold text-accentmikado-10 text-lg tracking-[0] leading-6 h-auto p-0 hover:bg-transparent`}
            >
              {legal.name}
            </Link>
          ))}
        </nav>

        <div className="flex lg:w-[394px] w-full items-center gap-3 justify-center">
          {/* <Button
            variant="ghost"
            className="flex w-12 h-12 px-3 pl-4 pt-[10px] relative items-center justify-center gap-2 rounded-[30px]"
          >
            <TiktokIcon />
          </Button> */}
          <Link
            href="https://www.instagram.com/domiburguer_"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-0! focus:ring-0!"
          >
            <Button
              variant="ghost"
              className="flex w-12 h-12 px-3 py-2 relative items-center justify-center gap-2 rounded-[30px]"
            >
              <InstagramIcon />
            </Button>
          </Link>
          {/* <Link
            href="mailto:info@domiburguer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-0! focus:ring-0!"
          >
            <Button
              variant="ghost"
              className="flex w-12 h-12 px-3 py-2 relative items-center justify-center gap-2 rounded-[30px]"
            >
              <EmailIcon />
            </Button>
          </Link> */}
          <Link
            href={`https://wa.me/573506186772?text=${encodeURIComponent("Hola, estaba en la pagina de Domi Burger y quiero más información")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-0! focus:ring-0!"
          >
            <Button
              variant="ghost"
              className="inline-flex h-12 px-5 py-2 relative items-center justify-center gap-2 rounded-[30px]  text-black"
            >
              <div className=" relative w-fit whitespace-nowrap ">
                CONTÁCTANOS
              </div>

              <WhatsAppIcon />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-[90px] items-center justify-between px-20 py-4 relative self-stretch w-full bg-primary-red">
        {/* <a className="relative w-fit mb-5 md:mb-0 font-semibold text-base tracking-[0] leading-5 whitespace-nowrap h-auto p-0 hover:bg-transparent">
          Cookies
        </a> */}

        <div className="items-start flex-1 grow flex justify-end gap-2 relative">
          <div className="relative w-fit mt-[-1.00px] font-semibold text-base tracking-[0] leading-5 whitespace-nowrap">
            2025, Todos los derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
};
