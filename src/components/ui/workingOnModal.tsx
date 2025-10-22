"use client";
import React, { useEffect } from "react";
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
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
