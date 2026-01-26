"use client";

import React from "react";
import { PencilIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuantitySelector } from "@/components/ui/quantitySelector";
import Image from "next/image";
import { CartItem } from "@/store/cartStore";
import { Complements } from "@/components/ui/complements";

interface CartItemCardProps {
    item: CartItem;
    onEditComplements: (item: CartItem) => void;
    onRemoveComplement: (itemId: string, complementId: number) => void;
    onDecrease: (id: string, quantity: number) => void;
    onIncrease: (id: string, quantity: number) => void;
}

export const CartItemCard = ({
    item,
    onEditComplements,
    onRemoveComplement,
    onDecrease,
    onIncrease,
}: CartItemCardProps) => {
    return (
      <Card
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
              alt="Domiburguer papitas"
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
                    onClick={() => {
                                        onEditComplements(item)
                                    }
                                    }
                                />
                            )}
              </div>
            </div>

            <Complements
              complements={item.complements}
              onRemove={(complementId) =>
                            onRemoveComplement(item.id, complementId)
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
                                onDecrease(item.id, item.quantity)
                            }
                onIncrease={() =>
                                onIncrease(item.id, item.quantity)
                            }
                        />
            </div>
          </div>
        </CardContent>
      </Card>
    );
};
