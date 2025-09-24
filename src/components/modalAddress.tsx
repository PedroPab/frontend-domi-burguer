"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { MapPinIcon } from "./ui/icons";
import { Switch } from "./ui/switch";

interface ModalAddressProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalAddress = ({ isOpen, onClose }: ModalAddressProps) => {
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    if (isOpen) {
      window.history.pushState({ modalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else {
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex-col flex p-0 bg-background h-auto rounded-2xl lg:w-[900px] lg:h-[680px]  z-500">
        <DialogTitle className="mb-4 pt-[24px] pl-[20px] lg:pl-[32px] lg:pt-[32px] font-bold text-[18px]! md:text-[20px]! leading-[20px]! md:leading-[22px]! text-neutral-black-80">
          NUEVA DIRECCIÓN
        </DialogTitle>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 h-full">
          <div className="flex flex-1 flex-col px-[20px] lg:pl-[32px] lg:pr-0">
            <p className="body-font mb-5">
              Selecciona los ingredientes que quieres agregar o los que deseas
              retirar.
            </p>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Input
                  className="shadow-none"
                  placeholder={"Nueva dirección"}
                />
                <MapPinIcon className=" w-[22px] h-[22px] absolute right-5 top-1/2 -translate-y-1/2 bottom-[50%]" />
              </div>
              <Input
                className="shadow-none"
                placeholder={"Nombre de la ubicación"}
              />
              <div className="flex gap-2">
                <Input
                  className="shadow-none"
                  placeholder={"Nombre de la ubicación"}
                />
                <Input
                  className="shadow-none"
                  placeholder={"Unidad, piso, apto"}
                />
              </div>
              <div className="relative w-full">
                <textarea
                  maxLength={200}
                  className="w-full h-[100px] shadow-sm px-5 py-4 rounded-2xl border-[1.5px] border-[#cccccc] resize-none outline-none [font-family:'Montserrat',Helvetica] font-normal text-neutrosblack-80 text-sm leading-[18px] tracking-[0]"
                />
                <span className="absolute bottom-3 right-3 text-gray-400 text-sm pointer-events-none">
                  0/100
                </span>
              </div>
              <div className="flex items-center justify-between mb-1 lg:mb-6">
                <label htmlFor="include-photo" className="body-font text-[16px]! font-bold">
                  Incluir foto de tu ubicación
                </label>
                <Switch id="include-photo" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[223px] bg-accent-yellow-40"></div>
        </div>
        <div className="flex pr-[32px] w-full justify-between pl-[20px] pb-[24px] mt-[16px] lg:pl-[32px] lg:pb-[32px] lg:mt-[32px]">
          <Button
            className="text-neutral-black-80 bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[200px] h-[48px]"
            onClick={onClose}
          >
            CERRAR
          </Button>
          <Button className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[200px] h-[48px]">
            CONFIRMAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
