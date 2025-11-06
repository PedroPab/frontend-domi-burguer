
"use client";

import React from "react";
import { CalendarIcon, PencilIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SpikesIcon } from "@/components/ui/icons";
import { QuantitySelector } from "@/components/ui/quantitySelector";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/store/cartStore";
import { Complements } from "@/components/ui/complements";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";

interface CartSummaryProps {
    items: CartItem[];
    formatCurrency: (value: number) => string;
    isMounted: boolean;
    getSubtotal: () => number;
    getDeliveryFee: () => number;
    getTotal: () => number;
    handleEditComplements: (item: CartItem) => void;
    removeComplement: (itemId: string, complementId: number) => void;
    handleDecrease: (id: string, quantity: number) => void;
    handleIncrease: (id: string, quantity: number) => void;
    addItem: (item: CartItem) => void;
    isSubmitting: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
    items,
    formatCurrency,
    isMounted,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    handleEditComplements,
    removeComplement,
    handleDecrease,
    handleIncrease,
    addItem,
    isSubmitting,
}) => {
    return (
        <div className="flex flex-col gap-8 max-w-[500px] justify-center w-full h-full">
            <Card className="flex-col shadow-none bg-transparent! rounded-2xl flex h-full w-full border-0">
                <SpikesIcon className="w-full" />
                <CardContent className="p-0 w-full">
                    <div className="px-4 xl:px-6 py-2 bg-accent-yellow-10 flex flex-col items-start gap-8 w-full">
                        <div className="inline-flex flex-col gap-4 items-start w-full">
                            <h2 className="mt-[-1.00px]">RESUMEN DEL PEDIDO</h2>

                            <div className="w-full h-8 gap-4 flex items-center">
                                <p className="body-font font-bold flex-1">
                                    Programar el envío de mi pedido
                                </p>
                                <Tooltip text="Próximamente">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-accent-yellow-10 inline-flex px-3 py-2 rounded-[20px] border-[1.5px] border-solid border-[#313131] items-center justify-center gap-2 h-auto"
                                        disabled={true}
                                    >
                                        <div className="w-fit font-bold [font-family:'Montserrat',Helvetica] text-neutral-black-80 text-xs leading-[18px] ">
                                            PROGRAMAR
                                        </div>
                                        <CalendarIcon className="w-[15px] h-[15px]" />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-8 w-full">
                            <div className="flex flex-col items-start gap-4 w-full">
                                {items.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="flex w-full xl:h-28 items-start gap-4 pl-2 pr-3 xl:pr-4 py-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden border-0"
                                    >
                                        <CardContent className="p-0 flex w-full gap-4 items-center justify-start">
                                            <div className="w-24 h-24 min-w-24 bg-accent-yellow-40 rounded-[7.66px] relative">
                                                <Image
                                                    src={item.image1}
                                                    alt="Burger"
                                                    width={67}
                                                    height={105}
                                                    className={
                                                        item.name.toLowerCase().includes("salsa")
                                                            ? "absolute top-[5px] left-[3px] w-[118px] h-[85px] object-cover overflow-visible"
                                                            : `object-cover absolute ${item.image2
                                                                ? "left-[5px] top-[-5px]"
                                                                : "top-[-5px] left-[15px]"
                                                            }`
                                                    }
                                                />

                                                {item.image2 && (
                                                    <Image
                                                        src={item.image2}
                                                        alt="Domiburger papitas"
                                                        width={57}
                                                        height={84}
                                                        className="object-cover absolute top-5 left-[41px]"
                                                    />
                                                )}
                                            </div>

                                            <div className="justify-center w-full max-w-[316px] gap-2 xl:gap-3 pt-1 pb-0 px-0 flex-1 grow flex flex-col items-start self-stretch">
                                                <div className="flex gap-3 self-stretch w-full rounded-[80.62px] flex-col items-start">
                                                    <div className="gap-3 self-stretch w-full flex items-center">
                                                        <div className="flex-1 font-h4">{item.name}</div>
                                                        {item.name.includes("SALSA DE AJO") ? null : (
                                                            <PencilIcon
                                                                className="w-4 h-4 cursor-pointer hover:text-neutral-black-60 transition-colors"
                                                                onClick={() => handleEditComplements(item)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <Complements
                                                    complements={item.complements}
                                                    onRemove={(complementId) =>
                                                        removeComplement(item.id, complementId)
                                                    }
                                                />

                                                <div className="flex h-8 items-center justify-between w-full rounded-[50px]">
                                                    <h4 className="">
                                                        ${item.price.toLocaleString("es-CO")} X{" "}
                                                        {item.quantity}
                                                    </h4>

                                                    <QuantitySelector
                                                        size="sm"
                                                        value={item.quantity}
                                                        onDecrease={() =>
                                                            handleDecrease(item.id, item.quantity)
                                                        }
                                                        onIncrease={() =>
                                                            handleIncrease(item.id, item.quantity)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {items.length === 0 && (
                                    <>
                                        <div className="flex flex-col items-center justify-center w-full py-4">
                                            <h3 className="text-xl text-neutral-black-60">
                                                No hay productos en el carrito
                                            </h3>
                                            <Link href={"/"} className="focus:outline-0! focus:ring-0!">
                                                <Button
                                                    type="button"
                                                    className="text-white! rounded-[30px] flex items-center gap-2 w-[260px] xl:w-[260px] xl:h-[48px] h-[40px] label-font mt-4 shadow-none"
                                                >
                                                    <Plus /> AGREGAR PRODUCTOS
                                                </Button>
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>

                            <Separator orientation="horizontal" className="w-full!" />

                            {!items.some((item) =>
                                item.name.toLowerCase().includes("salsa")
                            ) && (
                                    <>
                                        <h2 className="">ACOMPAÑA TU BURGER</h2>

                                        <Card className="flex w-full h-28 items-start gap-4 pl-2 pr-4 py-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden border-0">
                                            <CardContent className="p-0 flex w-full gap-4">
                                                <div className="w-24 h-24 bg-accent-yellow-40 rounded-[7.66px] relative">
                                                    <Image
                                                        src="/salsaSmall.png"
                                                        alt="Salsa"
                                                        width={118}
                                                        height={85}
                                                        className="absolute top-[5px] left-[3px] w-[118px] h-[85px] object-cover overflow-visible"
                                                    />
                                                </div>

                                                <div className="justify-center gap-3 pt-1 pb-0 px-0 flex-1 grow flex flex-col items-start self-stretch">
                                                    <div className="flex gap-3 self-stretch w-full rounded-[80.62px] flex-col items-start">
                                                        <div className="gap-3 self-stretch w-full flex items-center">
                                                            <div className="flex-1 font-h4">
                                                                SALSA DE AJO DE LA CASA
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex h-8 items-center justify-between w-full rounded-[50px]">
                                                        <h4 className="">$25.000</h4>

                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            className="w-10 h-10 rounded-[30px] p-0"
                                                            onClick={() => {
                                                                const salsaItem: CartItem = {
                                                                    id: "product-38",
                                                                    productId: 38,
                                                                    name: "SALSA DE AJO DE LA CASA",
                                                                    price: 25000,
                                                                    basePrice: 25000,
                                                                    quantity: 1,
                                                                    image1: "/salsaSmall.png",
                                                                    complements: [],
                                                                };
                                                                addItem(salsaItem);
                                                            }}
                                                        >
                                                            <Plus className="text-white" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                        </div>

                        <div className="flex flex-col items-start gap-8 w-full">
                            <div className="flex flex-col items-start gap-10 w-full rounded-xl">
                                <div className="flex flex-col items-start justify-end gap-4 w-full">
                                    <div className="flex items-start gap-10 w-full">
                                        <p className="flex-1 mt-[-0.93px] body-font">Subtotal</p>

                                        <p className="w-fit mt-[-0.93px] body-font">
                                            ${isMounted ? formatCurrency(getSubtotal()) : "0"}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-10 w-full">
                                        <div className="flex-1 mt-[-0.93px] font-body font-[number:var(--body-font-weight)] text-neutrosblack-80 text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] [font-style:var(--body-font-style)]">
                                            Envío
                                        </div>

                                        <p className="w-fit body-font font-bold">
                                            ${isMounted ? formatCurrency(getDeliveryFee()) : "0"}
                                        </p>
                                    </div>

                                    <Separator orientation="horizontal" />

                                    <div className="flex items-center gap-10 w-full">
                                        <p className="flex-1 body-font font-bold">Total</p>

                                        <h2 className="w-fit mt-[-0.93px]">
                                            ${isMounted ? formatCurrency(getTotal()) : "0"}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start justify-end gap-6 w-full">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || items.length === 0}
                                    className={`text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[128px] h-[48px] disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? "w-auto" : "w-[128px]"
                                        }`}
                                >
                                    COMPRAR
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <SpikesIcon className="w-full rotate-180" />
            </Card>
        </div>
    );
};