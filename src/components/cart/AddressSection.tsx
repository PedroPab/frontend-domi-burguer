import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationCard } from "@/app/locations/LocationCard";
import { useCheckoutForm } from "@/contexts/CheckoutFormContext";
import { ModalAddress } from "./modalAddress";
import { ModalLocationsList } from "./ModalLocationsList";
import { useAddressManagement } from "@/hooks/cart/useAddressManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useSetFavoriteLocation } from "@/hooks/locations/useSetFavoriteLocation";



export function AddressSection() {

  const { addressClient, location, setLocation, listLocationsClient } = useCheckoutForm();
  const {
    isModalOpen,
    addressToEdit,
    handleCloseModal,
    handleOpenModal,
  } = useAddressManagement();

  const { user } = useAuth();
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const hasMultipleLocations = listLocationsClient && listLocationsClient.length > 0;
  const { setFavorite } = useSetFavoriteLocation({ locations: listLocationsClient, setLocations: () => { } });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <p className="body-font font-bold">¡Necesitamos tu dirección!</p>
        {user && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="inline-flex px-3 py-2 rounded-[20px] border-[1.5px] border-solid border-[#313131] items-center justify-center gap-2 h-auto"
              disabled={!hasMultipleLocations}
              onClick={() => setIsListModalOpen(true)}
            >
              Ver todas
            </Button>
          </div>
        )}
      </div>


      <Button
        type="button"
        variant="ghost"
        className="bg-accent-yellow-20 hover:bg-accent-yellow-40 active:bg-accent-yellow-40 rounded-[30px] flex items-center justify-center gap-2 w-full h-auto py-3 label-font"
        onClick={handleOpenModal}
      >
        <Plus />
        {user ? "AGREGAR DIRECCIÓN PERSONAL" : "AGREGAR DIRECCIÓN"}
      </Button>


      {location && (
        <div>
          <LocationCard
            location={location}
            onDelete={() => setLocation(null)}
            onSetFavorite={() => {
              setFavorite(location.id);
              setLocation({ ...location, favorite: true });
            }}
          />
          {addressClient?.deliveryPrice !== undefined && (
            <p className="text-sm text-neutral-600 mt-2">
              Envío: ${addressClient.deliveryPrice.toLocaleString("es-CO")}
            </p>
          )}
        </div>
      )}


      <ModalAddress
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        addressToEdit={addressToEdit}
      />

      <ModalLocationsList
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        locations={listLocationsClient || []}
      />

    </div>
  );
}
