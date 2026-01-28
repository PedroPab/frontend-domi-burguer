"use client";

import { Location } from "@/types/locations";
import { Heart, Trash2 } from "lucide-react";

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  onSetFavorite: (id: string) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onEdit,
  onDelete,
  onSetFavorite,
}) => {
  return (
    <div className="flex items-start justify-between py-4 gap-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <h3 className="font-semibold text-neutral-800 text-base">
          {location.name}
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          {location.city}{location.state ? `, ${location.state}` : ''}
        </p>
        <p className="text-sm text-neutral-600">
          {location.address}
        </p>
        {location.floor && (
          <p className="text-sm text-neutral-600">
            {location.floor}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onSetFavorite(location.id)}
          className={`p-2 transition-colors ${location.favorite ? "text-red-500" : "text-neutral-300 hover:text-red-400"}`}
          aria-label={location.favorite ? "Dirección favorita" : "Marcar como favorita"}
        >
          <Heart className="w-5 h-5" fill={location.favorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => onDelete(location.id)}
          className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
          aria-label="Eliminar dirección"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
