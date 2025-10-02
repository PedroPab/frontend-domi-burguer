"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  EmailIcon,
  InstagramIcon,
  MapPinIcon,
  TiktokIcon,
  WhatsAppIcon,
} from "../ui/icons";
import {
  GoogleMap,
  Marker,
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
import { Card, CardContent } from "../ui/card";
import { CalendarIcon, ClockIcon, X } from "lucide-react";
import { Separator } from "../ui/separator";

interface ModalAddressProps {
  isOpen: boolean;
  onClose: () => void;
}

const libraries: "places"[] = ["places"];

export const KitchenModal = ({ isOpen, onClose }: ModalAddressProps) => {
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
        aria-describedby="seleccionar direccion"
        onInteractOutside={(event) => {
          // evita cerrar si el click viene del contenedor de Google
          if (
            event.target instanceof HTMLElement &&
            event.target.closest(".pac-container")
          ) {
            event.preventDefault();
          }
        }}
        className="flex-col flex p-0 bg-background h-[731px]rounded-2xl lg:w-[820px] lg:h-[578px] z-600"
      >
        <div className="flex items-center justify-between mb-4 pt-[20px] px-[20px] lg:px-[32px] lg:pt-[32px]">
          <DialogTitle className=" font-bold text-[18px]! md:text-[20px]! leading-[20px]! md:leading-[22px]! text-neutral-black-80">
            INFORMACIÓN DE LA COCINA
          </DialogTitle>
          <Button
            className="p-0 bg-transparent shadow-none hover:bg-transparent active:bg-transparent"
            onClick={onClose}
          >
            <X className="text-black"/>
          </Button>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-2 px-[20px] lg:px-[32px] pb-[32px] lg:gap-6 h-full">
          <div className="flex flex-1 flex-col ">
            <div className="flex flex-col gap-3 lg:gap-4">
              <Select>
                <SelectTrigger className="text-neutral-black-50! body-font">
                  <SelectValue placeholder="Cocina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="op1">Opcion 1</SelectItem>
                  <SelectItem value="op2">Opcion 2</SelectItem>
                  <SelectItem value="op3">Opcion 3</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex h-10 items-center gap-4 px-4 py-2 bg-[#ecfce6] rounded-[12px] border border-solid border-[#68bc73]">
                <div className="flex justify-between gap-2 flex-1">
                  <span className=" font-normal text-neutral-black-80 text-sm tracking-[0] leading-[18px]">
                    Abierto
                  </span>
                  <div className="font-normal text-neutral-black-80 text-sm tracking-[0] leading-[18px]">
                    <span className="font-normal text-[#313131] text-sm tracking-[0] leading-[18px]">
                      Cerramos en{" "}
                    </span>
                    <span className="font-bold">04:28</span>
                  </div>
                </div>
              </div>
              <Card className="bg-[#F7F7F7] shadow-none rounded-2xl border-0">
                <CardContent className="p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="body-font font-bold">Horarios</span>
                  </div>

                  <Separator className="bg-gray-300" />

                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    <div className="flex items-start gap-1 flex-1">
                      <span className="flex-1 body-font ">Lunes a Viernes</span>
                      <span className="body-font font-bold">09 pm / 8 pm</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    <div className="flex items-start gap-1 flex-1">
                      <span className="flex-1 body-font">Sábado y Domingo</span>
                      <span className="body-font font-bold">11 am / 11 pm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#F7F7F7] shadow-none h-[68px] rounded-2xl border-0">
                <CardContent className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span className="flex-1 body-font">
                      Valor domicilio aprox.
                    </span>
                    <span className="body-font font-bold">$4.200</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 w-full">
                <Button
                  variant="ghost"
                  className="flex w-12 h-12 px-3 pl-4 pt-[10px] relative items-center justify-center gap-2 rounded-[30px]"
                >
                  <TiktokIcon />
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-12 h-12 px-3 py-2 relative items-center justify-center gap-2 rounded-[30px]"
                >
                  <InstagramIcon />
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-12 h-12 px-3 py-2 relative items-center justify-center gap-2 rounded-[30px]"
                >
                  <EmailIcon />
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex h-12 px-5 py-2 relative items-center justify-center gap-2 rounded-[30px]  text-black"
                >
                  <div className=" relative w-fit whitespace-nowrap ">
                    CONTÁCTANOS
                  </div>

                  <WhatsAppIcon />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[200px] w-full bg-accent-yellow-40">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  minHeight: "200px",
                }}
                center={coordinates || { lat: 6.3017314, lng: -75.5743796 }}
                zoom={coordinates ? 16 : 13}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  styles: silverMapStyle,
                }}
              >
                {coordinates && (
                  <Marker
                    position={coordinates}
                    icon={{
                      url: "/Pin.png",
                      scaledSize: new google.maps.Size(70, 80), // tamaño
                      anchor: new google.maps.Point(20, 40), // punto de anclaje
                    }}
                  />
                )}
              </GoogleMap>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
