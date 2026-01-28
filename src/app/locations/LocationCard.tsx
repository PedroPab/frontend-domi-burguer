"use client";

import Image from "next/image";
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
  const { lat, lng } = location.coordinates;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=400x150&scale=2&markers=color:red|${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  return (
    <div className="bg-gray-50 rounded-xl p-5 relative">
      <div className="flex gap-4">
        {/* Columna izquierda: info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-neutral-800 text-base">
                {location.name}
              </h3>
              {/* <button
                onClick={() => onEdit(location)}
                className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors shrink-0 ml-2"
                aria-label="Editar dirección"
              >
                <Pencil className="w-4 h-4" />
              </button> */}
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 hover:opacity-70 transition-opacity"
            >
              <p className="text-sm text-neutral-600">
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
            </a>
            {location.comment && (
              <p className="text-sm text-neutral-500 italic mt-1">
                {location.comment}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => onSetFavorite(location.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${location.favorite
                ? "text-white bg-[#e73533]"
                : "text-neutral-500 bg-neutral-200 hover:bg-neutral-300"
                }`}
              aria-label={location.favorite ? "Dirección favorita" : "Marcar como favorita"}
            >
              <Heart className="w-3.5 h-3.5" fill={location.favorite ? "currentColor" : "none"} />
              Favorita
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

        {/* Columna derecha: mapa */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block w-[45%] shrink-0 rounded-lg overflow-hidden hover:opacity-80 transition-opacity self-stretch"
        >
          <Image
            src={staticMapUrl}
            alt={`Mapa de ${location.name}`}
            width={400}
            height={150}
            className="w-full h-full object-cover"
            unoptimized
          />
        </a>
      </div>
    </div>
  );
};
