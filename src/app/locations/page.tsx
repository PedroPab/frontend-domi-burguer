"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Location } from "@/types/locations";
import { Loader2, Plus, ShieldCheck } from "lucide-react";
import { ModalAddress } from "@/components/cart/modalAddress";
import { LocationService } from "@/services/locationService";
import { getIdToken } from "firebase/auth";
import { CheckoutFormProvider } from "@/contexts/CheckoutFormContext";
import { Address } from "@/types/address";
import { LocationList } from "./LocationList";
import { ConfirmDeleteLocationModal } from "./ConfirmDeleteLocationModal";
import { PageHeader } from "@/components/ui/pageHeader";
import { useSetFavoriteLocation } from "@/hooks/locations/useSetFavoriteLocation";

export default function LocationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { setFavorite } = useSetFavoriteLocation({ locations, setLocations });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      setIsLoadingAddresses(true);
      setError(null);
      try {
        const token = await getIdToken(user);
        const userAddresses = await LocationService.getUserLocations(token);
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

  const handleDelete = (addressId: string) => {
    setDeleteTargetId(addressId);
  };

  const confirmDelete = async () => {
    if (!user || !deleteTargetId) return;
    try {
      const token = await getIdToken(user);
      await LocationService.deleteLocationProfile({ token, id: deleteTargetId });
      setLocations((prev) => prev.filter((a) => a.id !== deleteTargetId));
    } catch (err) {
      console.error("Error eliminando dirección", err);
    } finally {
      setDeleteTargetId(null);
    }
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
          <PageHeader title="Mis Direcciones" />

          <LocationList
            locations={locations}
            isLoading={isLoadingAddresses}
            error={error}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onSetFavorite={setFavorite}
          />

          <button
            onClick={handleOpenCreate}
            className="w-full py-4 bg-amber-50 rounded-full flex items-center justify-center gap-2 text-neutral-800 font-medium hover:bg-amber-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
            AGREGAR DIRECCIÓN
          </button>

          <div className="flex items-center gap-2 mt-6 text-neutral-400 text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Guardaremos tu información de forma segura</span>
          </div>
        </div>

        <ModalAddress
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          addressToEdit={addressToEdit}
        />

        <ConfirmDeleteLocationModal
          isOpen={!!deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </CheckoutFormProvider>
  );
}
