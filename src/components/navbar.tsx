import { UserIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogoDesktop, HamburgerIcon, WhatsAppIcon, LogoMobile } from "./ui/icons";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-300 w-full px-4">
      <div className="max-w-[828px] md:h-[80px] h-[62px] gap-2 py-0 mt-[20px] mb-[10px] rounded-[60px] border border-solid border-[#e6e6e6] flex items-center justify-between w-full mx-auto px-4 sm:px-6 lg:px-8 bg-[#ffffff]">
        <div className="flex w-[300px] h-14 px-0 py-3 rounded-[50px] overflow-hidden items-center">
          <Button
            variant="ghost"
            className="inline-flex h-10 lg:h-12 justify-center px-[10px] lg:px-5 lg:py-2  mt-[-8.00px] mb-[-8.00px] rounded-[30px] items-center bg-transparent outline-none border-none focus:ring-0"
          >
            <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-neutrosblack-80 font-label hidden md:block">
              CUENTA
            </span>
          </Button>
          <Button
            variant="ghost"
            className="inline-flex h-10 lg:h-12 justify-center px-3 lg:px-5 py-2 mt-[-8.00px] mb-[-8.00px] rounded-[30px] items-center bg-transparent"
          >
            <span className="text-neutrosblack-80 font-label font-[number:var(--label-font-weight)] text-[length:var(--label-font-size)] tracking-[var(--label-letter-spacing)] leading-[var(--label-line-height)] whitespace-nowrap [font-style:var(--label-font-style)]">
              COCINA
            </span>
          </Button>
        </div>

        <div className="flex flex-col w-[130px] h-14 items-center justify-center gap-2">
          <div className="hidden md:block w-[106px] h-14">
            <Link href={"/"}>
              <LogoDesktop height={58} width={106} />
            </Link>
          </div>

          {/* Icono para móvil */}
          <div className="block md:hidden">
            <Link href={"/"}>
              <LogoMobile width={28} height={40} />
            </Link>
          </div>
        </div>

        <div className="w-[300px] items-center flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="flex w-12 h-12 px-3 py-2 bg-accent-yellow-20 cursor-pointer items-center justify-center gap-2 rounded-[30px] "
          >
            <WhatsAppIcon className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          <Link href={"/cart"}>
            <Button
              variant="default"
              className="h-[42px] min-w-16 lg:h-12 py-2 ps-3 pe-1 lg:pl-5 lg:pr-2 lg:py-2 items-center justify-center gap-2 rounded-[30px] cursor-pointer"
            >
              <HamburgerIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              <span className="text-white whitespace-nowrap font-bold hidden md:block">
                ORDENAR
              </span>
              <div className="flex flex-col w-8 h-8 items-center justify-center gap-2 bg-accentmikado-10 rounded-[20px]">
                <span className="text-black whitespace-nowrap font-bold text-[16px] bg-amber-50 h-8 w-8 rounded-[20px] text-center pt-1 lg:mr-2">
                  0
                </span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
