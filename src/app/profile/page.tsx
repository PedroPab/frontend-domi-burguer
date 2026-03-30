"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    LogOut,
    Plus,
    Phone,
    ChevronRight,
    CheckCircle,
} from "lucide-react";
import { Location } from "@/types/locations";
import { LocationService } from "@/services/locationService";
import { getIdToken } from "firebase/auth";
import { CheckoutFormProvider } from "@/contexts/CheckoutFormContext";
import { Address } from "@/types/address";
import { LocationCard } from "@/app/locations/LocationCard";
import { ComingSoonSection } from "./ComingSoonSection";

// Lazy load modales pesados
const PhoneVerificationModal = dynamic(
    () => import("@/components/phone/PhoneVerificationModal").then(mod => mod.PhoneVerificationModal),
    { ssr: false }
);
const ModalAddress = dynamic(
    () => import("@/components/cart/modalAddress").then(mod => mod.ModalAddress),
    { ssr: false }
);

export default function ProfilePage() {
    const { user, loading, logout, reloadUser } = useAuth();
    const router = useRouter();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [phoneModalOpen, setPhoneModalOpen] = useState(false);
    const [phoneModalMode, setPhoneModalMode] = useState<"link" | "change">("link");

    // Estados para direcciones
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Cargar direcciones
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;
            setIsLoadingAddresses(true);
            try {
                const token = await getIdToken(user);
                const userAddresses = await LocationService.getUserLocations(token);
                setLocations(userAddresses.body);
            } catch (err) {
                console.error("Error cargando direcciones del usuario", err);
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            router.push("/");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleOpenPhoneModal = (mode: "link" | "change") => {
        setPhoneModalMode(mode);
        setPhoneModalOpen(true);
    };

    const handlePhoneVerified = async () => {
        await reloadUser();
    };

    // Funciones para direcciones
    const mapLocationToAddress = (location: Location): Address => {
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

    const handleOpenCreate = () => {
        setAddressToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (location: Location) => {
        setAddressToEdit(mapLocationToAddress(location));
        setIsModalOpen(true);
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);
        setAddressToEdit(null);
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

    const handleRefresh = async () => {
        if (!user) return;
        try {
            const token = await getIdToken(user);
            const userAddresses = await LocationService.getUserLocations(token);
            setLocations(userAddresses.body);
        } catch (err) {
            console.error("Error recargando direcciones", err);
        }
    };

    // Obtener nombre para el saludo
    const getUserFirstName = () => {
        if (user?.displayName) {
            return user.displayName.split(" ")[0].toUpperCase();
        }
        return "USUARIO";
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-primary-red" size={70} />
            </div>
        );
    }

    return (
        <CheckoutFormProvider>
            <div className="mt-[130px] min-h-screen bg-white py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
                                HOLA {getUserFirstName()}
                            </h1>
                            {user.email && (
                                <p className="text-neutral-500 text-sm mt-1">{user.email}</p>
                            )}
                        </div>
                        <Button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            variant="ghost"
                            size="sm"
                            className="text-neutral-500 hover:text-primary-red hover:bg-red-50"
                        >
                            {isLoggingOut ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <LogOut className="w-5 h-5" />
                            )}
                        </Button>
                    </div>

                    {/* Sección MIS DIRECCIONES */}
                    <div className="mb-8">
                        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-4">
                            MIS DIRECCIONES
                        </h2>

                        {isLoadingAddresses ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-primary-red" size={32} />
                            </div>
                        ) : locations.length === 0 ? (
                            <div className="bg-gray-50 rounded-xl p-6 text-center mb-4">
                                <p className="text-neutral-500">
                                    Aún no tienes direcciones guardadas
                                </p>
                            </div>
                        ) : (
                            <div className="mb-4">
                                {locations.map((location) => (
                                    <LocationCard
                                        key={location.id}
                                        location={location}
                                        onEdit={handleOpenEdit}
                                        onRefresh={handleRefresh}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Botón agregar dirección */}
                        <button
                            onClick={handleOpenCreate}
                            className="w-full py-4 border-2 border-dashed border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-700 font-medium hover:border-primary-red hover:text-primary-red transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            AGREGAR DIRECCIÓN
                        </button>

                        {/* Mensaje de seguridad */}
                        <div className="flex items-center gap-3 mt-6 text-neutral-400 text-sm">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span>Guardaremos tu información de forma segura</span>
                        </div>
                    </div>

                    {/* Sección MI TELÉFONO */}
                    <div className="mb-8">
                        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-4">
                            MI TELÉFONO
                        </h2>
                        <button
                            onClick={() => handleOpenPhoneModal(user.phoneNumber ? "change" : "link")}
                            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <Phone className="w-5 h-5 text-neutral-500" />
                                <div className="text-left">
                                    {user.phoneNumber ? (
                                        <>
                                            <p className="font-medium text-neutral-800">
                                                {user.phoneNumber}
                                            </p>
                                            <p className="text-xs text-green-600">
                                                Verificado
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-medium text-neutral-500">
                                                Agregar número de teléfono
                                            </p>
                                            <p className="text-xs text-primary-red">
                                                Toca para verificar
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-400" />
                        </button>
                    </div>

                    {/* Sección MIS PEDIDOS - Próximamente */}
                    <ComingSoonSection title="MIS PEDIDOS" />

                    {/* Sección MIS CÓDIGOS - Próximamente */}
                    <ComingSoonSection title="MIS CÓDIGOS" />
                </div>

                {/* Modal de dirección */}
                <ModalAddress
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    addressToEdit={addressToEdit}
                />

                {/* Modal de verificación de teléfono */}
                <PhoneVerificationModal
                    open={phoneModalOpen}
                    onOpenChange={setPhoneModalOpen}
                    mode={phoneModalMode}
                    onSuccess={handlePhoneVerified}
                />
            </div>
        </CheckoutFormProvider>
    );
}
