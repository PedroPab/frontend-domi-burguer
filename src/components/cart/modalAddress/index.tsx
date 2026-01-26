"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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

interface ModalAddressProps {
    isOpen: boolean;
    onClose: () => void;
    addressToEdit?: Address | null;
}

export const ModalAddress = ({
    isOpen,
    onClose,
}: ModalAddressProps) => {

    const { user } = useAuth();

    const { setAddress } = useCartStore();
    const { setAddressClient, setLocation, setListLocationsClient, listLocationsClient } = useCheckoutForm();
    // Google Maps ya maneja esto internamente a través del hook useGooglePlaces

    const { formState, updateField, resetForm, isFormValid } =
        useAddressForm();

    // Hook de envío
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
            console.error('Error al crear dirección:', error);
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

    // Manejo de navegación del navegador
    useEffect(() => {
        const handlePopState = () => {
            onClose();
        };

        if (isOpen) {
            window.history.pushState({ addressModalOpen: true }, "");
            window.addEventListener("popstate", handlePopState);
        }

        return () => {
            window.removeEventListener("popstate", handlePopState);
            // Limpiar el estado del historial solo cuando el modal se desmonta
            if (isOpen && window.history.state?.addressModalOpen) {
                window.history.back();
            }
        };
    }, [isOpen, onClose]);

    const handleConfirm = async () => {
        if (!isFormValid()) return;

        try {
            let token: string | null = null;
            if (user) {
                token = await getIdToken(user)

                console.log('Usuario autenticado, manejando dirección con autenticación');
                // await handleAuthenticatedUser();
            } else {
                console.log('momo Usuario invitado , manejando dirección sin autenticación');
                // await handleGuestUser();
            }
            const address = await submitAddress(createLocationData(), token as unknown as null | undefined)
            console.log('Dirección confirmada:', address);
        } catch (error) {
            console.error('Error al confirmar dirección:', error);
        }
    };

    const createLocationData = () => ({
        name: formState.addressName,
        address: formState.address,
        coordinates: formState.coordinates,
        propertyType: formState.selectedType,
        floor: formState.floor || '',
        comment: formState.comment || ''
    });


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                footer={
                    <ActionsButtons onClose={onClose} isSubmitting={isSubmitting} isFormValid={isFormValid} handleConfirm={handleConfirm} />
                }
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
                <DialogHeader className="lg:px-[32px]!">
                    <DialogTitle className="mb-4 pt-[24px] pl-[20px] lg:pt-[32px] font-bold text-[18px]! md:text-[20px]! leading-[20px]! md:leading-[22px]! text-neutral-black-80 text-center lg:text-left lg:pl-0!">
                        NUEVA DIRECCIÓN
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="mx-[20px] lg:mx-[32px] mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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



            </DialogContent>
        </Dialog>
    );
};
