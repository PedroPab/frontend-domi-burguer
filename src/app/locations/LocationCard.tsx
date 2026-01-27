"use client";

import { Location } from "@/types/locations";
import { Pencil, Trash2 } from "lucide-react";

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

        {location.favorite ? (
          <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-white bg-[#c4d600] rounded-full">
            Principal
          </span>
        ) : (
          <button
            onClick={() => onSetFavorite(location.id)}
            className="inline-block mt-2 px-3 py-1 text-xs font-medium text-neutral-500 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
          >
            Marcar como principal
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* <button
          onClick={() => onEdit(location)}
          className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Editar dirección"
        >
          <Pencil className="w-5 h-5" />
        </button> */}
        <button
          onClick={() => onDelete(location.id)}
          className="p-2 text-red-400 hover:text-red-600 transition-colors"
          aria-label="Eliminar dirección"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
