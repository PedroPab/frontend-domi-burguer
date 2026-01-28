"use client";

import { Loader2 } from "lucide-react";
import { Location } from "@/types/locations";
import { LocationCard } from "./LocationCard";

interface LocationListProps {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
  onEdit: (location: Location) => void;
  onDelete: (addressId: string) => void;
  onSetFavorite: (locationId: string) => void;
}

export function LocationList({
  locations,
  isLoading,
  error,
  onEdit,
  onDelete,
  onSetFavorite,
}: LocationListProps) {
  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary-red" size={40} />
        </div>
      ) : locations.length === 0 ? (
        <div className="py-10 text-center text-neutral-500">
          <p className="mb-4">Aún no tienes direcciones guardadas.</p>
        </div>
      ) : (
        <div className="mb-6 space-y-4">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={onEdit}
              onDelete={onDelete}
              onSetFavorite={onSetFavorite}
            />
          ))}
        </div>
      )}
    </>
  );
}
