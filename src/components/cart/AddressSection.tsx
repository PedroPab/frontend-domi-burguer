import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressCard from "../AddressCard";
import { useCheckoutForm } from "@/contexts/CheckoutFormContext";
import { ModalAddress } from "./modalAddress";
import { ModalLocationsList } from "./ModalLocationsList";
import { useAddressManagement } from "@/hooks/cart/useAddressManagement";
import { useAuth } from "@/contexts/AuthContext";



export function AddressSection() {

    //si no es usuario autenticado , miramos si tiene direccion en el local storage
    const { addressClient, location, listLocationsClient } = useCheckoutForm();
    console.log('%caddressClient in AddressSection :', 'color: blue;', addressClient);
    const {
        isModalOpen,
        addressToEdit,
        handleEditAddress,
        removeAddress,
        handleCloseModal,
        handleOpenModal,
    } = useAddressManagement();

    const { user } = useAuth();
    const [isListModalOpen, setIsListModalOpen] = useState(false);

    useEffect(() => {
        if (!addressClient) {
            console.log("No addressClient found in AddressSection.");
        }
    }, []);

    const hasMultipleLocations = listLocationsClient && listLocationsClient.length > 0;

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
                className="bg-accent-yellow-20 hover:bg-accent-yellow-40 active:bg-accent-yellow-40 rounded-[30px] flex items-center gap-2 xl:w-[260px] xl:h-[48px] h-[40px] w-full label-font"
                onClick={handleOpenModal}
            >
                <Plus />
                {user ? "AGREGAR DIRECCIÓN PERSONAL" : "AGREGAR DIRECCIÓN"}
            </Button>


            {addressClient !== null && addressClient !== undefined && (
                <AddressCard
                    address={addressClient}
                />
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