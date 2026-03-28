"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAddressSubmit } from "@/hooks/address/useAddressSubmit";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import { Address } from "@/types/address";
import { Loader2 } from "lucide-react";
import { getIdToken } from "firebase/auth";
import { useCheckoutForm } from "@/contexts/CheckoutFormContext";
import CreateAddressInputSection from "./createAddressInputSection";
import { useAddressForm } from "@/hooks/address/useAddressForm";
import ActionsButtons from "./ActionsButtons";
import { useCartStore } from "@/store/cartStore";
import { Modal } from "@/components/ui/modal";
import { modalErrorVariants } from "@/components/ui/modal/variants";
import { cn } from "@/lib/utils";

interface ModalAddressProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: Address | null;
}

export const ModalAddress = ({ isOpen, onClose }: ModalAddressProps) => {
  const { user } = useAuth();

  const { setAddress } = useCartStore();
  const {
    setAddressClient,
    setLocation,
    setListLocationsClient,
    listLocationsClient,
  } = useCheckoutForm();

  const { formState, updateField, resetForm, isFormValid } = useAddressForm();

  const { submitAddress, isSubmitting, error } = useAddressSubmit(
    ({ location, address }) => {
      setListLocationsClient([...listLocationsClient, location]);
      setLocation(location);
      setAddressClient(address);
      setAddress(address);
      onClose();
      resetForm();
    },
    (error) => {
      console.error("Error al crear dirección:", error);
    }
  );

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

  const handleConfirm = async () => {
    if (!isFormValid()) return;

    try {
      let token: string | null = null;
      if (user) {
        token = await getIdToken(user);
        console.log("Usuario autenticado, manejando dirección con autenticación");
      } else {
        console.log("momo Usuario invitado , manejando dirección sin autenticación");
      }
      const address = await submitAddress(
        createLocationData(),
        token as unknown as null | undefined
      );
      console.log("Dirección confirmada:", address);
    } catch (error) {
      console.error("Error al confirmar dirección:", error);
    }
  };

  const createLocationData = () => ({
    name: formState.addressName,
    address: formState.address,
    coordinates: formState.coordinates,
    propertyType: formState.selectedType,
    floor: formState.floor || "",
    comment: formState.comment || "",
  });

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="NUEVA DIRECCIÓN"
      size="xl"
      ariaLabel="seleccionar direccion"
      preventCloseSelectors={[".pac-container"]}
      footer={
        <ActionsButtons
          onClose={onClose}
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          handleConfirm={handleConfirm}
        />
      }
      contentClassName="lg:w-[900px] lg:h-[680px]"
      bodyClassName="px-5 lg:px-8"
    >
      {error && (
        <div className={cn(modalErrorVariants({ type: "error" }), "mb-4")}>
          {error}
        </div>
      )}

      {isSubmitting && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-2xl">
          <Loader2 className="animate-spin text-primary-red" size={70} />
        </div>
      )}

      <CreateAddressInputSection
        isLoaded={isLoaded}
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        formState={formState}
        updateField={updateField}
      />
    </Modal>
  );
};
