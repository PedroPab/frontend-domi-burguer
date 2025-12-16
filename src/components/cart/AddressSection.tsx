import React from "react";
import { User } from "firebase/auth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressCard from "../addressCard";
import { Address } from "@/types/address";

interface AddressSectionProps {
    user: User | null;
    addressClient: Address;
    onOpenModal: () => void;
    onEditAddress: () => void;
    onRemoveAddress: () => void;
}

export function AddressSection({
    user,
    addressClient,
    onOpenModal,
    onEditAddress,
    onRemoveAddress,
}: AddressSectionProps) {

    //si no es usuario autenticado , miramos si tiene direccion en el local storage



    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <p className="body-font font-bold">¡Necesitamos tu dirección!</p>
                {user && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="inline-flex px-3 py-2 rounded-[20px] border-[1.5px] border-solid border-[#313131] items-center justify-center gap-2 h-auto"
                            disabled={true}
                        >
                            Ver todas
                        </Button>
                    </div>
                )}
            </div>


            <Button
                type="button"
                variant="ghost"
                className="bg-accent-yellow-20 hover:bg-accent-yellow-40 active:bg-accent-yellow-40 rounded-[30px] flex items-center gap-2 xl:w-[260px] xl:h-[48px] h-[40px] w-full label-font"
                onClick={onOpenModal}
            >
                <Plus />
                {user ? "AGREGAR DIRECCIÓN PERSONAL" : "AGREGAR DIRECCIÓN"}
            </Button>

            <AddressCard
                address={addressClient}
                onEditAddress={onEditAddress}
                onRemoveAddress={onRemoveAddress}
            />


        </div>
    );
}