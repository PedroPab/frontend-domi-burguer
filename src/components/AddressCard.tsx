import { Address } from "@/types/address";
import { Card, CardContent } from "./ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface addressCardProps {
    address: Address
    // onEditAddress: () => void;
    // onRemoveAddress: () => void;
}

const AddressCard = ({
    // onEditAddress,
    // onRemoveAddress,
    address
}: addressCardProps) => {
    console.log('siii address in AddressCard :', address);

    return <Card className="gap-6 p-5 w-full bg-accent-yellow-10 rounded-[12px] shadow-none border-0">
        <CardContent className="p-0">
            <div className="flex justify-between gap-6 w-full">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                        <h5 className="body-font font-bold">{address.name || "Nombre del hogar"}</h5>
                        <div className="body-font flex flex-col gap-1">
                            <span>{address.address || "Dirección no especificada"}</span>
                            {address.floor && <span>Piso: {address.floor}</span>}
                            <span>{address.city}, {address.country}</span>
                            {address.propertyType && <span>Tipo: {address.propertyType}</span>}
                            {address.comment && <span>Comentario: {address.comment}</span>}
                        </div>
                    </div>
                </div>
                <div className="flex gap-5">
                    <div className="flex flex-col">
                        <h2 className="flex-1">
                            {address.deliveryPrice !== undefined
                                ? `$${address.deliveryPrice.toLocaleString("es-CO")}`
                                : ""}
                        </h2>
                        <span>{address.kitchen || ""}</span>
                    </div>
                    {/* <div className="flex flex-col justify-between">
                        <Pencil
                            className="h-[18px] w-[18px] xl:mt-[2px] cursor-pointer hover:text-neutral-black-60"
                            onClick={onEditAddress} />
                        <Trash2
                            className="h-[18px] w-[18px] xl:mt-[2px] cursor-pointer text-red-500 hover:text-red-700"
                            onClick={onRemoveAddress} />
                    </div> */}
                </div>
            </div>
        </CardContent>
    </Card>;
};

export default AddressCard;