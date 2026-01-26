import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Location } from "@/types/locations";
import { useCheckoutForm } from "@/contexts/CheckoutFormContext";
import { MapPin, Home, Building } from "lucide-react";

interface ModalLocationsListProps {
    isOpen: boolean;
    onClose: () => void;
    locations: Location[];
}

export function ModalLocationsList({ isOpen, onClose, locations }: ModalLocationsListProps) {
    const { setLocation } = useCheckoutForm();

    const handleSelectAddress = (location: Location) => {
        setLocation(location);
        onClose();
    };

    const getPropertyIcon = (propertyType?: string) => {
        if (!propertyType) return <Home className="w-5 h-5 text-neutral-black-60" />;

        switch (propertyType.toLowerCase()) {
            case 'casa':
            case 'house':
                return <Home className="w-5 h-5 text-neutral-black-60" />;
            case 'apartamento':
            case 'apartment':
                return <Building className="w-5 h-5 text-neutral-black-60" />;
            default:
                return <MapPin className="w-5 h-5 text-neutral-black-60" />;
        }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[650px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Mis direcciones</DialogTitle>
            <p className="text-sm text-neutral-black-60 mt-1">Selecciona una dirección de entrega</p>
          </DialogHeader>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2">
            {locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectAddress(loc)}
                className="w-full text-left p-4 rounded-xl border-2 border-neutral-black-20 bg-white hover:bg-accent-yellow-20 hover:border-accent-yellow-80 active:bg-accent-yellow-40 focus:outline-none focus:ring-2 focus:ring-accent-yellow-80 focus:border-accent-yellow-80 transition-all duration-200 group"
                        >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {getPropertyIcon(loc.propertyType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="body-font font-bold text-neutral-black-100 mb-1.5 group-hover:text-accent-yellow-100">
                      {loc.name}
                    </h5>
                    <div className="body-font flex flex-col gap-0.5 text-sm text-neutral-black-80">
                      <span className="line-clamp-2">{loc.address}</span>
                      <span className="text-neutral-black-60">{loc.city}, {loc.country}</span>
                      {loc.propertyType && (
                        <span className="text-xs text-neutral-black-60 mt-0.5">
                          {loc.propertyType}
                        </span>
                                        )}
                    </div>
                  </div>
                </div>
              </button>
                    ))}
          </div>
        </DialogContent>
      </Dialog>
    );
}
