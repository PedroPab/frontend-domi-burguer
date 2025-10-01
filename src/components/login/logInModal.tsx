"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { GoogleIcon, MapPinIcon } from "../ui/icons";
import { Switch } from "../ui/switch";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { silverMapStyle } from "@/utils/mapStyles";
import { Separator } from "../ui/separator";

interface ModalAddressProps {
  isOpen: boolean;
  onClose: () => void;
}

const libraries: "places"[] = ["places"];

export const LogInModal = ({ isOpen, onClose }: ModalAddressProps) => {
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

  // Estados principales
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Ref del autocomplete
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Cargar script de Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  // Cuando se elige un lugar del autocomplete
  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();

    if (place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      if (typeof lat === "number" && typeof lng === "number") {
        setCoordinates({ lat, lng });
        if (place.formatted_address) {
          setAddress(place.formatted_address);
        }
      }
    }
  };

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
            INICIA SESIÓN
          </DialogTitle>
          <p className="body-font">
            ¡Te hemos enviado un código de verificación a tu número de celular!
            Escribe el código para continuar con tu registro.
          </p>
          <div className="flex flex-col gap-4">
            <div className="w-full pl-6 pr-0 py-0 flex h-12 items-center justify-center relative rounded-[30px] border-[1.5px] border-solid border-[#cccccc]">
              <div className="text-sm relative w-fit [font-family:'Montserrat',Helvetica] font-bold text-neutrosblack-80 tracking-[0] leading-[18px] whitespace-nowrap">
                +57
              </div>

              <div className="bg-[#cccccc] ml-6 w-[1px] h-full rotate-180"></div>

              <Input placeholder="322  55  67  23" className="border-none shadow-none w-full" />
            </div>
            <Input
              className="gap-4 px-5 py-0 self-stretch w-full flex h-12 items-center justify-center relative rounded-[30px] border-[1.5px] border-solid border-[#cccccc] tracking-[0.8em]  space-x-3 bg-transparent text-neutral-black-50! font-normal! leading-[18px] text-center text-[20px]!"
              placeholder="0679"
              style={{
                fontFamily: "Montserrat, Helvetica",
              }}
            />

            <div className="flex justify-between px-5">
              <p
                style={{
                  fontFamily: "Montserrat, Helvetica",
                }}
                className="body-font"
              >
                Código valido por
              </p>{" "}
              <span className=" body-font font-bold">15:00</span>
            </div>

            <Button className="text-white rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]">
              VERIFICAR
            </Button>

            <div className="flex items-center gap-5 mb-2">
              <Separator className="h-[2.2px] flex-1 grow" />
              <span className="body-font text-neutral-black-50!">
                O ingresa con
              </span>
              <Separator className="h-[2.2px] flex-1 grow" />
            </div>

            <Button
              variant={"outline"}
              className="text-white 20 rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]"
            >
              <GoogleIcon />
            </Button>
          </div>
        </div>
        {/*<div className="flex pr-[32px] w-full justify-between pl-[20px] pb-[24px] mt-[16px] lg:pl-[32px] lg:pb-[32px] lg:mt-[32px]">
          <Button
            className="text-neutral-black-80 bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[200px] h-[48px]"
            onClick={onClose}
          >
            CERRAR
          </Button>
          <Button className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[200px] h-[48px]">
            CONFIRMAR
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
};
