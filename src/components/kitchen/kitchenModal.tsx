"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InstagramIcon, MapPinIcon, WhatsAppIcon } from "../ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Calendar, Clock } from "lucide-react";
import { Separator } from "../ui/separator";
import { MapComponent } from "../map/map";
import { AddressService } from "@/services/kitchenService";
import { Kitchen } from "@/types/kitchens";
import { LocationService } from "@/services/locationService";
import { Modal } from "@/components/ui/modal";

interface KitchenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KitchenModal = ({ isOpen, onClose }: KitchenModalProps) => {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKitchens = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        const response = await AddressService.findKitchens();
        if (response.body.length > 0) {
          setSelectedKitchen(response.body[0]);
        }
        const listKitchens: Kitchen[] = [];
        response.body.forEach(async (kitchen) => {
          const locationResponse = await LocationService.getLocationId(
            kitchen.locationId
          );
          if (locationResponse && locationResponse.body) {
            console.log("locationResponse.body", locationResponse.body);
            kitchen.location = locationResponse.body;
          }
          listKitchens.push(kitchen);
        });
        setKitchens(listKitchens);
      } catch (error) {
        console.error("Error al cargar las cocinas:", error);
        setKitchens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKitchens();
  }, [isOpen]);

  useEffect(() => {
    console.log("selectedKitchen", selectedKitchen);
  }, [selectedKitchen]);

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="INFORMACIÓN DE LA COCINA"
      size="xl"
      footer={false}
      ariaLabel="seleccionar direccion"
      bodyClassName="px-5 pb-8 lg:px-8"
    >
      <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-6 h-full">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-3 lg:gap-4">
            <Select
              onValueChange={(value) => {
                const kitchen = kitchens.find((k) => k.id === value);
                setSelectedKitchen(kitchen || null);
              }}
            >
              <SelectTrigger className="text-neutral-black-50! body-font">
                <SelectValue
                  placeholder={
                    loading
                      ? "Cargando cocinas..."
                      : selectedKitchen?.name || "Seleccionar cocina"
                  }
                />
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
              </CardContent>
            </Card>

            <Card className="bg-[#F7F7F7] shadow-none h-[68px] rounded-2xl border-0">
              <CardContent className="px-6 py-6">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  <span className="flex-1 body-font">Valor domicilio aprox.</span>
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
                <div className="relative w-fit whitespace-nowrap">CONTÁCTANOS</div>
                <WhatsAppIcon />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-[200px] w-full bg-accent-yellow-40 rounded-xl overflow-hidden">
          <MapComponent
            coordinates={{
              lat: selectedKitchen?.location?.coordinates?.lat ?? 6.3017314,
              lng: selectedKitchen?.location?.coordinates?.lng ?? -75.5743796,
            }}
            minHeight="200px"
          />
        </div>
      </div>
    </Modal>
  );
};
