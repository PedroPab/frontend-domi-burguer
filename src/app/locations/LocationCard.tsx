"use client";

import { Location } from "@/types/locations";
import { Heart, Pencil, Trash2 } from "lucide-react";

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
  const googleMapsUrl = `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`;

  return (
    <div className="bg-gray-50 rounded-xl p-5 relative">
      <div className="flex justify-between items-start">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 pr-10 cursor-pointer hover:opacity-70 transition-opacity"
        >
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
          {location.comment && (
            <p className="text-sm text-neutral-500 italic mt-1">
              {location.comment}
            </p>
          )}
        </a>

        <button
          onClick={() => onEdit(location)}
          className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Editar dirección"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => onSetFavorite(location.id)}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
            location.favorite
              ? "text-white bg-[#e73533]"
              : "text-neutral-500 bg-neutral-200 hover:bg-neutral-300"
          }`}
          aria-label={location.favorite ? "Dirección favorita" : "Marcar como favorita"}
        >
          <Heart className="w-3.5 h-3.5" fill={location.favorite ? "currentColor" : "none"} />
          {location.favorite ? "Favorita" : "Marcar como favorita"}
        </button>

        <button
          onClick={() => onDelete(location.id)}
          className="p-1 text-red-400 hover:text-red-600 transition-colors"
          aria-label="Eliminar dirección"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
