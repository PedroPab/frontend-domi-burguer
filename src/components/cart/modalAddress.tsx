"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { MapPinIcon } from "../ui/icons";
import { Switch } from "../ui/switch";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MapComponent } from "../map/map";
import { useAddressForm } from "@/hooks/address/useAddressForm";
import { useAddressSubmit } from "@/hooks/address/useAddressSubmit";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import { useCartStore } from "@/store/cartStore";

import { Address, PropertyType } from "@/types/address";
import { Loader2 } from "lucide-react";

interface ModalAddressProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: Address | null;
}

export const ModalAddress = ({
  isOpen,
  onClose,
  addressToEdit,
}: ModalAddressProps) => {
  const { setAddress } = useCartStore();
  // Referencias para el input del autocomplete
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Hook de formulario con datos iniciales si está editando
  const initialData = addressToEdit
    ? {
        address: addressToEdit.address,
        floor: addressToEdit.floor || "",
      }
    : undefined;

  const { formState, updateField, resetForm, isFormValid } =
    useAddressForm(initialData);

  // Hook de envío
  const { submitAddress, isSubmitting, error } = useAddressSubmit(
    (addressData) => {
      setAddress(addressData);
      onClose();
      resetForm();
    },
    (error) => {
      console.error("Error al crear dirección:", error);
    }
  );

  // Hook de Google Places
  const { isLoaded, onLoad, onPlaceChanged } = useGooglePlaces((place) => {
    if (place.geometry?.location && place.formatted_address) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      if (typeof lat === "number" && typeof lng === "number") {
        updateField("coordinates", { lat, lng });
        updateField("address", place.formatted_address);
      }
    }
  });

  // Cargar datos de dirección cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && addressToEdit) {
      updateField("address", addressToEdit.fullAddress);
      updateField("floor", addressToEdit.floor || "");
      updateField("comment", addressToEdit.comment || "");
      updateField("addressName", addressToEdit.name);
      updateField("coordinates", addressToEdit.coordinates);
      updateField("selectedType", addressToEdit.propertyType || "");
    }
  }, [isOpen, addressToEdit]);

  // Manejo de navegación del navegador
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    if (isOpen) {
      window.history.pushState({ addressModalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else {
      if (window.history.state?.addressModalOpen) {
        window.history.back();
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  const handleConfirm = async () => {
    if (!isFormValid()) return;
    await submitAddress(formState);
  };
  //es la cede de medellin, esta es la refencia para centrar el mapa y para buscar los resultados del autocomplete
  const centerOrigin = { lat: 6.3017314, lng: -75.5743796 };

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
        className="flex-col flex p-0 bg-background h-auto rounded-2xl lg:w-[900px] lg:h-[680px] z-600"
      >
        {isSubmitting ? (
          <div className="h-96 lg:h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-red-500" size={70} />
          </div>
        ) : (
          <>
            <DialogTitle className="mb-4 pt-[24px] pl-[20px] lg:pl-[32px] lg:pt-[32px] font-bold text-[18px]! md:text-[20px]! leading-[20px]! md:leading-[22px]! text-neutral-black-80">
              {addressToEdit ? "EDITAR DIRECCIÓN" : "NUEVA DIRECCIÓN"}
            </DialogTitle>

            {error && (
              <div className="mx-[20px] lg:mx-[32px] mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 h-full">
              <div className="flex flex-1 flex-col px-[20px] lg:pl-[32px] lg:pr-0">
                <p className="body-font mb-5">
                  Selecciona la ubicación en el mapa y completa los datos de tu
                  dirección.
                </p>

                <div className="flex flex-col gap-2">
                  {isLoaded && (
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                      fields={[
                        "geometry",
                        "name",
                        "formatted_address",
                        "address_components",
                        "types",
                      ]}
                      options={{
                        componentRestrictions: { country: "co" },
                        bounds: {
                          north: centerOrigin.lat + 0.5,
                          south: centerOrigin.lat - 0.5,
                          east: centerOrigin.lng + 0.5,
                          west: centerOrigin.lng - 0.5,
                        },
                        strictBounds: true,
                      }}
                    >
                      <div className="relative">
                        <Input
                          className="shadow-none pr-12"
                          placeholder="Nueva dirección"
                          value={formState.address}
                          onChange={(e) =>
                            updateField("address", e.target.value)
                          }
                        />
                        <MapPinIcon className="w-[22px] h-[22px] absolute right-5 top-1/2 -translate-y-1/2" />
                      </div>
                    </Autocomplete>
                  )}

                  <Input
                    className="shadow-none"
                    placeholder="Nombre de la ubicación (ej: Casa, Oficina)"
                    value={formState.addressName}
                    onChange={(e) => updateField("addressName", e.target.value)}
                    id="name"
                    name="name"
                  />

                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value) =>
                        updateField("selectedType", value as PropertyType)
                      }
                      value={formState.selectedType}
                    >
                      <SelectTrigger className="text-neutral-black-50! body-font">
                        <SelectValue defaultValue="house" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="building">Edificio</SelectItem>
                        <SelectItem value="urbanization">
                          Urbanización
                        </SelectItem>
                        <SelectItem value="office">Oficina</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      className="shadow-none"
                      value={formState.floor}
                      id="floor"
                      name="floor"
                      onChange={(e) => updateField("floor", e.target.value)}
                      placeholder="Unidad, piso, apto"
                      required
                    />
                  </div>

                  <div className="relative w-full">
                    <textarea
                      placeholder="Alguna referencia?"
                      value={formState.comment}
                      onChange={(e) => updateField("comment", e.target.value)}
                      id="comment"
                      name="comment"
                      maxLength={200}
                      className="body-font w-full placeholder:text-neutral-black-50 h-[100px] shadow-sm px-5 py-4 rounded-2xl border-[1.5px] border-[#cccccc] resize-none outline-none text-neutrosblack-80"
                    />
                    <span className="absolute bottom-3 right-3 text-gray-400 text-sm pointer-events-none">
                      {formState.comment.length}/200
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-1 lg:mb-6">
                    {/* <label
                    htmlFor="include-photo"
                    className="body-font text-[16px]! font-bold"
                  >
                    Incluir foto de tu ubicación
                  </label>
                  <Switch id="include-photo" /> */}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-[223px] w-full bg-accent-yellow-40">
                <MapComponent
                  coordinates={formState.coordinates}
                  minHeight="223px"
                />
              </div>
            </div>

            <div className="flex px-[20px] w-full gap-7 pb-[24px] justify-center lg:justify-between mt-[16px] lg:px-[45px] lg:mt-[32px]">
              <Button
                type="button"
                className="text-neutral-black-80 bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[151px] h-[40px] lg:w-[200px] lg:h-[48px]"
                onClick={onClose}
                disabled={isSubmitting}
              >
                CERRAR
              </Button>
              <Button
                className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[151px] h-[40px] lg:w-[200px] lg:h-[48px]"
                disabled={isSubmitting || !isFormValid()}
                onClick={handleConfirm}
              >
                {isSubmitting ? "GUARDANDO..." : "CONFIRMAR"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
