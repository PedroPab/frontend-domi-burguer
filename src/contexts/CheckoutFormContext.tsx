import useGetLocationByUser from "@/hooks/locations/useGetLocationByUser";
import { Address } from "@/types/address";
import { Location } from "@/types/locations";
import { getIdToken } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { AddressService } from "@/services/addressService";

// Define aquí los campos que necesitas compartir
export interface FormValues {
    [key: string]: string | number | boolean | undefined | null | object;
}

interface CheckoutFormData {
    formData: FormValues;
    setFormData: (data: FormValues) => void;
    addressClient: Address | null;
    setAddressClient: (address: Address | null) => void;
    listLocationsClient: Location[];
    setListLocationsClient: (locations: Location[]) => void;
    location: Location | null;
    setLocation: (location: Location | null) => void;
    isLoadingDeliveryPrice: boolean;
}

const CheckoutFormContext = createContext<CheckoutFormData | undefined>(undefined);

export const CheckoutFormProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useAuth();
    const [token, setToken] = useState<string>("");

    // Obtener el token del usuario autenticado
    useEffect(() => {
        const fetchToken = async () => {
            if (user) {
                const idToken = await getIdToken(user);
                setToken(idToken);
            } else {
                setToken("");
            }
        };
        fetchToken();
    }, [user]);

    const { locations, fetchLocations } = useGetLocationByUser(token);

    const [formData, setFormData] = useState<FormValues>({});

    const [addressClient, setAddressClient] = useState<Address | null>(null);
    const [listLocationsClient, setListLocationsClient] = useState<Location[]>([]);


    //la location seleccionada actualmente, o la se creo recientemente
    const [location, setLocation] = useState<Location | null>(null);
    const [isLoadingDeliveryPrice, setIsLoadingDeliveryPrice] = useState(false);

    useEffect(() => {
        const fetchAddressData = async () => {
            if (location) {
                setIsLoadingDeliveryPrice(true);
                try {
                    // Consultamos el Address del location seleccionado
                    const { delivery, kitchen } = await AddressService.createDelivery(location.id);
                    console.log('Datos de delivery obtenidos para la ubicación seleccionada:', { kitchen });
                    const rta: Address = {
                        ...location,
                        distance: delivery.distance,
                        fullAddress: location.address,
                        deliveryPrice: delivery.price,
                        // kitchen: kitchen,//por alguna razon da error si lo descomento

                    };
                    console.log('Datos de delivery obtenidos para la ubicación seleccionada:', rta);
                    setAddressClient(rta);
                } catch (error) {
                    console.error("Error al obtener datos de delivery:", error);
                    setAddressClient(null);
                } finally {
                    setIsLoadingDeliveryPrice(false);
                }
            } else {
                setAddressClient(null);
            }
        };

        fetchAddressData();
    }, [location]);

    useEffect(() => {
        setListLocationsClient(locations);

        // Seleccionar location por defecto solo si no hay una seleccionada
        if (locations.length > 0 && !location) {
            // Buscar la favorita
            const favoriteLocation = locations.find(loc => loc.favorite);

            if (favoriteLocation) {
                setLocation(favoriteLocation);
            } else {
                // Si no hay favorita, usar la última actualizada
                const sortedByDate = [...locations].sort(
                    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
                setLocation(sortedByDate[0]);
            }
        }
    }, [locations]);

    useEffect(() => {
        if (token) {
            fetchLocations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);


    return (
        <CheckoutFormContext.Provider value={{
            formData, setFormData,
            addressClient, setAddressClient,
            listLocationsClient, setListLocationsClient,
            location, setLocation,
            isLoadingDeliveryPrice
        }}>
            {children}
        </CheckoutFormContext.Provider>
    );
};

export const useCheckoutForm = () => {
    const context = useContext(CheckoutFormContext);
    if (!context) throw new Error("useCheckoutForm debe usarse dentro de CheckoutFormProvider");
    return context;
};
