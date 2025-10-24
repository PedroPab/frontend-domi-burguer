"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { GoogleIcon } from "../ui/icons";
import { Separator } from "../ui/separator";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkingOnModal = ({ isOpen, onClose }: ModalProps) => {
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    if (isOpen) {
      window.history.pushState({ modalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Solo hacer back si el modal se está cerrando y el estado actual es modalOpen
      if (!isOpen && window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="Iniciar sesión"
        onInteractOutside={(event) => {
          // evita cerrar si el click viene del contenedor de Google
          if (
            event.target instanceof HTMLElement &&
            event.target.closest(".pac-container")
          ) {
            event.preventDefault();
          }
        }}
        className="flex-col flex bg-background sm:top-105 p-4 lg:p-6 rounded-2xl lg:w-[820px] h-[600px] z-600"
      >
        <div className="flex mt-6 lg:mt-0 flex-col rounded-2xl px-[30px] lg:px-[140px] w-full justify-center gap-6 h-full bg-[#F7F7F7]">
          <DialogTitle className=" font-bold text-[20px]! md:text-[24px]! leading-[22px]! md:leading-[26px]! text-neutral-black-80;">
            ESTAMOS TRABAJANDO EN ESTA FUNCIÓN
          </DialogTitle>
          <div className="flex flex-col gap-4">
            <p className="text-neutral-600">
              Nuestro equipo está trabajando arduamente para implementarla y ofrecerte la mejor experiencia posible.
            </p>
            <p className="text-neutral-600">
              Mientras tanto, te invitamos a explorar otras características de
              nuestra aplicación. ¡Gracias por tu paciencia y comprensión!
            </p>
          </div>
          {/* imagen de gato trabajando  */}
          <div className="flex justify-center">
            <Image
              src="/catWork.jpg"
              alt="Gato trabajando"
              className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] object-contain mb-5"
              width={200}
              height={400}
            />
          </div>
        </div>

        <div className="flex pr-[32px] w-full justify-center pl-[20px] pb-[24px] mt-[16px] lg:pl-[32px] lg:pb-[32px] lg:mt-[32px]">
          <Button
            type="button"
            className="text-neutral-black-80 bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[200px] h-[48px]"
            onClick={onClose}
          >
            CERRAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
