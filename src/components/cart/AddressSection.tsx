import React from "react";
import { User } from "firebase/auth";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Address } from "@/types/address";

interface AddressSectionProps {
    user: User | null;
    addressStore: Address | null;
    onOpenModal: () => void;
    onEditAddress: () => void;
    onRemoveAddress: () => void;
}

export function AddressSection({
    user,
    addressStore,
    onOpenModal,
    onEditAddress,
    onRemoveAddress,
}: AddressSectionProps) {
    const hasAddress = addressStore?.coordinates && addressStore?.country;

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <p className="body-font font-bold">¡Necesitamos tu dirección!</p>
                {user && (
                    <span className="text-sm text-primary-red">
                        Usando dirección personal
                    </span>
                )}
            </div>

            {!hasAddress ? (
                <Button
                    type="button"
                    variant="ghost"
                    className="bg-accent-yellow-20 hover:bg-accent-yellow-40 active:bg-accent-yellow-40 rounded-[30px] flex items-center gap-2 xl:w-[260px] xl:h-[48px] h-[40px] w-full label-font"
                    onClick={onOpenModal}
                >
                    <Plus />
                    {user ? "AGREGAR DIRECCIÓN PERSONAL" : "AGREGAR DIRECCIÓN"}
                </Button>
            ) : (
                <Card className="gap-6 p-5 w-full bg-accent-yellow-10 rounded-[12px] shadow-none border-0">
                    <CardContent className="p-0">
                        <div className="flex justify-between gap-6 w-full">
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-2">
                                    <h5 className="body-font font-bold">{addressStore.name}</h5>
                                    <div className="body-font flex flex-col gap-1">
                                        <span>
                                            {addressStore.city}, {addressStore.country}
                                        </span>
                                        <span>{addressStore.address}</span>
                                        <span>{addressStore.floor}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="flex flex-col">
                                    <h2 className="flex-1">
                                        ${(addressStore.deliveryPrice ?? 0).toLocaleString("es-CO")}
                                    </h2>
                                    <span>{addressStore.kitchen}</span>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <Pencil
                                        className="h-[18px] w-[18px] xl:mt-[2px] cursor-pointer hover:text-neutral-black-60"
                                        onClick={onEditAddress}
                                    />
                                    <Trash2
                                        className="h-[18px] w-[18px] xl:mt-[2px] cursor-pointer text-red-500 hover:text-red-700"
                                        onClick={onRemoveAddress}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}