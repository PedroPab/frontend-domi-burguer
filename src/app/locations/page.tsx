"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Location } from "@/types/locations";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { ModalAddress } from "@/components/cart/modalAddress";
import { LocationService } from "@/services/locationService";
import { getIdToken } from "firebase/auth";
import { LocationCard } from "./LocationCard";
import { CheckoutFormProvider } from "@/contexts/CheckoutFormContext";
import { Address } from "@/types/address";

// Tipo local para adaptar un Location al shape que espera ModalAddress


export default function LocationsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Objeto tipo "address" solo para compatibilidad con ModalAddress (sin usar el tipo Address real)
    const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

    // Proteger ruta: si no hay usuario, mandar a /login
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Cargar ubicaciones del usuario autenticado
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;
            setIsLoadingAddresses(true);
            setError(null);
            try {
                const token = await getIdToken(user);
                const userAddresses = await LocationService.getUserLocations(token);
                console.log("userAddresses: ", userAddresses)
                setLocations(userAddresses.body);
            } catch (err) {
                console.error("Error cargando direcciones del usuario", err);
                setError("No se pudieron cargar tus direcciones");
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const handleOpenCreate = () => {
        setAddressToEdit(null);
        setIsModalOpen(true);
    };

    const mapLocationToAddressLike = (location: Location): Address => {
        return {
            id: location.id,
            name: location.name,
            address: location.address,
            fullAddress: location.address,
            city: location.city,
            country: location.country,
            floor: location.floor,
            comment: location.comment,
            propertyType: location.propertyType || "",
            coordinates: {
                lat: location.coordinates.lat ?? 0,
                lng: location.coordinates.lng ?? 0,
            },
            distance: 0,
            deliveryPrice: 0,
        };
    };

    const handleOpenEdit = (location: Location) => {
        setAddressToEdit(mapLocationToAddressLike(location));
        setIsModalOpen(true);
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);
        setAddressToEdit(null);
        // Después de cerrar el modal, recargar lista desde API de locations
        if (user) {
            try {
                const token = await getIdToken(user);
                const userAddresses = await LocationService.getUserLocations(token);
                setLocations(userAddresses.body);
            } catch (err) {
                console.error("Error recargando direcciones", err);
            }
        }
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm("¿Seguro que quieres eliminar esta dirección?")) return;
        try {
            // TODO: implementar eliminación vía LocationService cuando el backend lo soporte
            setLocations((prev) => prev.filter((a) => a.id !== addressId));
        } catch (err) {
            console.error("Error eliminando dirección", err);
            alert("No se pudo eliminar la dirección");
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-primary-red" size={70} />
            </div>
        );
    }

    return (
        <CheckoutFormProvider>

            <div className="mt-[130px] min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-neutral-black-80 mb-2">
                                Mis direcciones
                            </h1>
                            <p className="text-neutral-black-60">
                                Gestiona las ubicaciones donde recibes tus pedidos
                            </p>
                        </div>

                        <Button
                            onClick={handleOpenCreate}
                            className="h-11 px-4 flex items-center gap-2 rounded-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva dirección
                        </Button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {isLoadingAddresses ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-primary-red" size={40} />
                        </div>
                    ) : locations.length === 0 ? (
                        <div className="py-10 text-center text-neutral-black-60">
                            <p className="mb-4">Aún no tienes direcciones guardadas.</p>
                            <Button onClick={handleOpenCreate}>
                                <Plus className="w-4 h-4 mr-2" /> Agregar primera dirección
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {locations.map((location) => (
                                <LocationCard
                                    key={location.id}
                                    location={location}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <ModalAddress
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    // Cast local porque ModalAddress espera Address, pero aquí usamos Location -> AddressLike
                    addressToEdit={addressToEdit}
                />
            </div>
        </CheckoutFormProvider>
    );
}
