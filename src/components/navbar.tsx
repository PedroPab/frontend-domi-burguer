"use client";

import { UserIcon } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LogoDesktop,
  HamburgerIcon,
  WhatsAppIcon,
  LogoMobile,
} from "./ui/icons";
import Link from "next/link";
import { LogInModal } from "./login/logInModal";
import { useCartStore } from "@/store/cartStore";
import { WorkingOnModal } from "./ui/workingOnModal";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const [isAcountModalOpen, setIsAcountModalOpen] = useState(false);
  const [isKitchenModalOpen, setIsKitchenModalOpen] = useState(false);
  const { items } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const itemsCount = items.map((item) => item.quantity).reduce((a, b) => a + b, 0);
  return (
    <>
      <nav
        className={`fixed top-0 left-0  ${isAcountModalOpen || isKitchenModalOpen ? "z-600" : "z-300"
          } w-full px-4`}
      >
        <div className="max-w-[828px] md:h-[80px] h-[62px] gap-2 py-0 mt-[20px] mb-[10px] rounded-[60px] border border-solid border-[#e6e6e6] flex items-center justify-between w-full mx-auto px-4! sm:px-6 lg:px-8 bg-[#ffffff]">
          <div className="flex w-[300px] h-14 px-0 py-3 rounded-[50px] overflow-hidden items-center">
            <Button
              onClick={() => {
                if (user) {
                  router.push("/profile");
                } else {
                  setIsAcountModalOpen(true);
                }
              }}
              variant="ghost"
              className={`inline-flex h-10 lg:h-12 justify-center px-[10px] lg:px-5 lg:py-2  mt-[-8.00px] mb-[-8.00px] rounded-[30px] items-center bg-transparent outline-none border-none focus:outline-0! focus:ring-0! focus:bg-accent-yellow-20 ${isAcountModalOpen ? "bg-accent-yellow-20" : ""
                }`}
            >
              {user && user.photoURL ? (
                <Avatar className="w-7 h-7 md:w-8 md:h-8 mr-1">
                  <AvatarImage src={user.photoURL} alt={user.displayName || "Usuario"} />
                  <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              ) : (
                <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
              )}
              <span className="text-neutrosblack-80 font-label hidden md:block">
                {user ? user.displayName?.split(" ")[0] || "CUENTA" : "CUENTA"}
              </span>
            </Button>
            <Button
              onClick={() => setIsKitchenModalOpen(true)}
              variant="ghost"
              className={`inline-flex h-10 lg:h-12 justify-center px-3 lg:px-5 py-2 mt-[-8.00px] mb-[-8.00px] rounded-[30px] items-center bg-transparent focus:outline-0! focus:ring-0! focus:bg-accent-yellow-20 ${isKitchenModalOpen ? "bg-accent-yellow-20" : ""
                }`}
            >
              <span className="text-neutrosblack-80 font-label font-[number:var(--label-font-weight)] text-[length:var(--label-font-size)] tracking-[var(--label-letter-spacing)] leading-[var(--label-line-height)] whitespace-nowrap [font-style:var(--label-font-style)]">
                COCINA
              </span>
            </Button>
          </div>

          <div className="flex flex-col w-[130px] h-14 items-center justify-center gap-2">
            <div className="hidden md:block w-[106px] h-14 ">
              <Link href={"/"} className="focus:outline-0! focus:ring-0!">
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
            <Link
              href={`https://wa.me/573506186772?text=${encodeURIComponent("Hola, estaba en la pagina de Domi Burguer y quiero más información")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-0! focus:ring-0!"
            >
              <Button
                variant="ghost"
                size="icon"
                className="flex w-10.5 h-10.5 px-3 py-2 bg-accent-yellow-20 hover:bg-accent-yellow-40 active:bg-accent-yellow-40 focus:bg-accent-yellow-40 cursor-pointer items-center justify-center gap-2 rounded-[30px] focus:outline-0! focus:ring-0!"
              >
                <WhatsAppIcon className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </Link>
            <Link
              href={"/cart"}
              tabIndex={-1}
              className="focus:outline-0! focus:ring-0! focus:bg-[#E10300] rounded-[30px]"
            >
              <Button
                variant="default"
                className="h-[44px] min-w-16 lg:h-12 py-2 ps-3 pe-[7px] lg:pl-5 lg:pr-2 lg:py-2 items-center justify-center gap-2 rounded-[30px] cursor-pointer focus:outline-0! focus:ring-0! focus:bg-[#E10300]"
              >
                <HamburgerIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="text-white whitespace-nowrap font-bold hidden md:block">
                  ORDENAR
                </span>
                <div className="flex flex-col w-8 h-8 items-center justify-center gap-2 rounded-[20px]">
                  <span className="text-black whitespace-nowrap font-bold text-[16px] bg-amber-50 h-8 w-8 rounded-[20px] text-center flex items-center justify-center">
                    {itemsCount}
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      <div>
        <LogInModal
          isOpen={isAcountModalOpen}
          onClose={() => setIsAcountModalOpen(false)}
        />
        {/* <WorkingOnModal
          isOpen={isAcountModalOpen}
          onClose={() => setIsAcountModalOpen(false)}
        /> */}
      </div>
      <div>
        {/* <KitchenModal
          isOpen={isKitchenModalOpen}
          onClose={() => setIsKitchenModalOpen(false)}
        /> */}
        <WorkingOnModal
          isOpen={isKitchenModalOpen}
          onClose={() => setIsKitchenModalOpen(false)}
        />
      </div>
    </>
  );
};
