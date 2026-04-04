import { Address } from "@/types/address";
import { Card, CardContent } from "./ui/card";
import { Heart, Loader2, Trash2 } from "lucide-react";

interface addressCardProps {
    address: Address;
    isFavorite?: boolean;
    isLoadingPrice?: boolean;
    onDelete?: () => void;
    isDeleting?: boolean;
}

const AddressCard = ({
    address,
    isFavorite = false,
    isLoadingPrice = false,
    onDelete,
    isDeleting = false,
}: addressCardProps) => {

    return (
        <Card className="gap-6 p-5 w-full bg-accent-yellow-10 rounded-[12px] shadow-none border-0">
            <CardContent className="p-0">
                <div className="flex justify-between gap-4 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2">
                            <h5 className="body-font font-bold">{address.name || "Nombre del hogar"}</h5>
                            {isFavorite && (
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            )}
                        </div>
                        <div className="body-font flex flex-col gap-0.5 text-neutral-black-60">
                            <span>{address.city}, {address.country}</span>
                            <span>{address.address || "Dirección no especificada"}</span>
                            {address.floor && <span>{address.floor}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                        <div className="flex items-start">
                            {isLoadingPrice ? (
                                <Loader2 className="h-6 w-6 animate-spin text-neutral-black-40" />
                            ) : (
                                <h2 className="text-xl font-bold">
                                    {address.deliveryPrice !== undefined
                                        ? `$${address.deliveryPrice.toLocaleString("es-CO")}`
                                        : ""}
                                </h2>
                            )}
                        </div>
                        {onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                disabled={isDeleting}
                                className="p-1 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                aria-label="Eliminar dirección"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AddressCard;
