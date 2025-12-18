import { Address } from "@/types/address";
import { Location } from "@/types/locations";
import React, { createContext, use, useContext, useEffect, useState } from "react";

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
    // Puedes agregar más estados y funciones según sea necesario
}

const CheckoutFormContext = createContext<CheckoutFormData | undefined>(undefined);

export const CheckoutFormProvider = ({ children }: { children: React.ReactNode }) => {
    const [formData, setFormData] = useState<FormValues>({});

    const [addressClient, setAddressClient] = useState<Address | null>(null);
    const [listLocationsClient, setListLocationsClient] = useState<Location[]>([]);


    //la location seleccionada actualmente, o la se creo recientemente
    const [location, setLocation] = useState<Location | null>(null);
    useEffect(() => {
        console.log('Location changed in CheckoutFormContext:', location);
        //calcular el nuevo addressClient cuando location cambie
        if (location) {
            console.log('Updating addressClient based on location change:', location);
        }
    }, [location]);

    useEffect(() => {
        console.log(addressClient);
    }, [addressClient]);

    //consultar todos las locationes del cliente 




    return (
        <CheckoutFormContext.Provider value={{
            formData, setFormData,
            addressClient, setAddressClient,
            listLocationsClient, setListLocationsClient,
            location, setLocation
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
