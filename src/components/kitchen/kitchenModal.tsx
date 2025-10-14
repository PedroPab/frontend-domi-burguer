"use client";
import React, { use, useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Calendar, Clock, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { MapComponent } from "../map/map";
import { AddressService } from "@/services/kitchenService";
import { Kitchen } from "@/types/kitchens";
import { LocationService } from "@/services/locationService";


interface KitchenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KitchenModal = ({ isOpen, onClose }: KitchenModalProps) => {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);
  const [loading, setLoading] = useState(false);


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

  useEffect(() => {
    const fetchKitchens = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        const response = await AddressService.findKitchens();
        // ponemos la primer cocian como defecto
        if (response.body.length > 0) {
          setSelectedKitchen(response.body[0]);
        }
        // consultamos las ubicacioines de manera asincrona con getLocationId
        // ponemos las coordenadas
        const listKitchens: Kitchen[] = [];
        response.body.forEach(async (kitchen) => {
          const locationResponse = await LocationService.getLocationId(kitchen.locationId);
          // ponemos las coordenadas
          if (locationResponse && locationResponse.body) {
            kitchen.location = locationResponse.body;
          }
          listKitchens.push(kitchen);

        });
        setKitchens(listKitchens);
      } catch (error) {
        console.error('Error al cargar las cocinas:', error);
        setKitchens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKitchens();
  }, [isOpen]);

  useEffect(() => {
    console.log('selectedKitchen', selectedKitchen);
  }, [selectedKitchen]);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="seleccionar direccion"
        onInteractOutside={(event) => {
          if (
            event.target instanceof HTMLElement &&
            event.target.closest(".pac-container")
          ) {
            event.preventDefault();
          }
        }}
        className="flex-col flex p-0 bg-background h-[731px] rounded-2xl lg:w-[820px] lg:h-[578px] z-600"
      >
        <div className="flex items-center justify-between mb-4 pt-[20px] px-[20px] lg:px-[32px] lg:pt-[32px]">
          <DialogTitle className="font-bold text-[18px]! md:text-[20px]! leading-[20px]! md:leading-[22px]! text-neutral-black-80">
            INFORMACIÓN DE LA COCINA
          </DialogTitle>
          <Button
            className="p-0 bg-transparent shadow-none hover:bg-transparent active:bg-transparent"
            onClick={onClose}
          >
            <X className="text-black" />
          </Button>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-2 px-[20px] lg:px-[32px] pb-[32px] lg:gap-6 h-full">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-3 lg:gap-4">
              <Select onValueChange={(value) => {
                const kitchen = kitchens.find(k => k.id === value);
                setSelectedKitchen(kitchen || null);
              }}>
                <SelectTrigger className="text-neutral-black-50! body-font">
                  <SelectValue placeholder={loading ? "Cargando cocinas..." : selectedKitchen?.name || "Seleccionar cocina"} />
                </SelectTrigger>
                <SelectContent>
                  {kitchens.map((kitchen) => (
                    <SelectItem key={kitchen.id} value={kitchen.id}>
                      {kitchen.name}
                    </SelectItem>
                  ))}
                  {!loading && kitchens.length === 0 && (
                    <SelectItem key="no-kitchens" value="no-kitchens" disabled>
                      Cocinas no encontradas
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>


              {/* <div className="flex h-10 items-center gap-4 px-4 py-2 bg-[#ecfce6] rounded-[12px] border border-solid border-[#68bc73]">
                <div className="flex justify-between gap-2 flex-1">
                  <span className="font-normal text-neutral-black-80 text-sm tracking-[0] leading-[18px]">
                    {selectedKitchen?.status === 'active' ? 'Abierto' : 'Cerrado'}
                  </span>
                  <div className="font-normal text-neutral-black-80 text-sm tracking-[0] leading-[18px]">
                    <span className="font-normal text-[#313131] text-sm tracking-[0] leading-[18px]">
                      {selectedKitchen?.phone || 'Teléfono no disponible'}
                    </span>
                  </div>
                </div>
              </div> */}

              <Card className="bg-[#F7F7F7] shadow-none rounded-2xl border-0">
                <CardContent className="p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="body-font font-bold">Horarios</span>
                  </div>

                  <Separator className="bg-gray-300" />

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <div className="flex items-start gap-1 flex-1">
                      <span className="flex-1 body-font">Lunes a Sabado</span>
                      <span className="body-font font-bold">4:30 pm / 10 pm</span>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <div className="flex items-start gap-1 flex-1">
                      <span className="flex-1 body-font">Domingo</span>
                      <span className="body-font font-bold">Descansando</span>
                    </div>
                  </div> */}
                </CardContent>
              </Card>

              <Card className="bg-[#F7F7F7] shadow-none h-[68px] rounded-2xl border-0">
                <CardContent className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span className="flex-1 body-font">
                      Valor domicilio aprox.
                    </span>
                    <span className="body-font font-bold">$3.500</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 w-full">
                <Button
                  variant="ghost"
                  className="flex w-12 h-12 px-3 py-2 relative items-center justify-center gap-2 rounded-[30px]"
                >
                  <InstagramIcon />
                </Button>
                {/* boton para googel maps */}
                <Button
                  variant="ghost"
                  className="flex w-12 h-12 px-3 py-2 relative items-center justify-center gap-2 rounded-[30px]"
                >
                  <MapPinIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex h-12 px-5 py-2 relative items-center justify-center gap-2 rounded-[30px] text-black"
                >
                  <div className="relative w-fit whitespace-nowrap">
                    CONTÁCTANOS
                  </div>
                  <WhatsAppIcon />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[200px] w-full bg-accent-yellow-40">
            <MapComponent
              coordinates={selectedKitchen?.location?.coordinates || { lat: 6.3017314, lng: -75.5743796 }}
              minHeight="200px"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};