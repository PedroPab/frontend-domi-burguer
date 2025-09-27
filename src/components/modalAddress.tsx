"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { MapPinIcon } from "./ui/icons";
import { Switch } from "./ui/switch";
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
} from "./ui/select";
import { silverMapStyle } from "@/utils/mapStyles";

interface ModalAddressProps {
  isOpen: boolean;
  onClose: () => void;
}

const libraries: "places"[] = ["places"];

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
        className="flex-col flex p-0 bg-background h-auto rounded-2xl lg:w-[900px] lg:h-[680px]  z-600"
      >
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
              {/* Input con Autocomplete */}
              {isLoaded && (
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                  }
                  onPlaceChanged={onPlaceChanged}
                  fields={[
                    "geometry",
                    "name",
                    "formatted_address",
                    "address_components",
                    "types",
                  ]}
                  options={{
                    componentRestrictions: { country: ["CO"] },
                    strictBounds: true,
                  }}
                >
                  <div className="relative">
                    <Input
                      className="shadow-none pr-12"
                      placeholder="Nueva dirección"
                      defaultValue={address} // ✅
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <MapPinIcon className="w-[22px] h-[22px] absolute right-5 top-1/2 -translate-y-1/2" />
                  </div>
                </Autocomplete>
              )}

              <Input
                className="shadow-none"
                placeholder={"Nombre de la ubicación"}
              />
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="text-neutral-black-50! body-font">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="op1">Casa</SelectItem>
                    <SelectItem value="op2">Edificio</SelectItem>
                    <SelectItem value="op3">Urbanización</SelectItem>
                    <SelectItem value="op4">Oficina</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  className="shadow-none"
                  placeholder={"Unidad, piso, apto"}
                />
              </div>
              <div className="relative w-full">
                <textarea
                  placeholder="Alguna referencia?"
                  maxLength={200}
                  className=" body-font w-full placeholder:text-neutral-black-50 h-[100px] shadow-sm px-5 py-4 rounded-2xl border-[1.5px] border-[#cccccc] resize-none outline-none text-neutrosblack-80 "
                />
                <span className="absolute bottom-3 right-3 text-gray-400 text-sm pointer-events-none">
                  0/100
                </span>
              </div>
              <div className="flex items-center justify-between mb-1 lg:mb-6">
                <label
                  htmlFor="include-photo"
                  className="body-font text-[16px]! font-bold"
                >
                  Incluir foto de tu ubicación
                </label>
                <Switch id="include-photo" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[223px] w-full bg-accent-yellow-40">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  minHeight: "223px",
                }}
                center={coordinates || { lat: 6.3017314, lng: -75.5743796 }}
                zoom={coordinates ? 16 : 13}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  styles: silverMapStyle, // 👈 usa el estilo importado
                }}
              >
                {coordinates && (
                  <Marker
                    position={coordinates}
                    icon={{
                      url: "/Pin.png", // ruta de tu ícono
                      scaledSize: new google.maps.Size(70, 80), // tamaño
                      anchor: new google.maps.Point(20, 40), // punto de anclaje
                    }}
                  />
                )}
              </GoogleMap>
            )}
          </div>
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
