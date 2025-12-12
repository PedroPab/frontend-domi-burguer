"use client";

import { Location } from "@/types/locations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Pencil, Trash2 } from "lucide-react";

interface LocationCardProps {
    location: Location;
    onEdit: (location: Location) => void;
    onDelete: (id: string) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
    location,
    onEdit,
    onDelete,
}) => {
    return (
        <Card className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="mt-1">
                    <MapPin className="w-5 h-5 text-primary-red" />
                </div>
                <div>
                    <h3 className="font-semibold text-neutral-black-80 flex items-center gap-2">
                        {location.name}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-black-10 text-neutral-black-60">
                            {location.propertyType || "sin tipo"}
                        </span>
                    </h3>
                    <p className="text-sm text-neutral-black-70 mt-1">{location.address}</p>
                    {location.floor && (
                        <p className="text-xs text-neutral-black-60 mt-1">
                            Detalle: {location.floor}
                        </p>
                    )}
                    {/* Si en el futuro Location incluye precio de domicilio u otros datos, se pueden mostrar aquí */}
                </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(location)}
                    className="w-9 h-9"
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(location.id)}
                    className="w-9 h-9 border-red-300 text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
};
