"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { Code } from "@/types/codes";

interface OrderTotalsProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  appliedCoupon?: Code | null;
  discount?: number;
}

export const OrderTotals = ({
  subtotal,
  deliveryFee,
  total,
  appliedCoupon,
  discount = 0,
}: OrderTotalsProps) => {
  const formatCurrency = (value: number): string => {
    if (isNaN(value)) return "0";
    return value.toLocaleString("es-CO");
  };

  return (
    <div className="flex flex-col items-start gap-10 w-full rounded-xl">
      <div className="flex flex-col items-start justify-end gap-4 w-full">
        <div className="flex items-start gap-10 w-full">
          <p className="flex-1 mt-[-0.93px] body-font">Subtotal</p>
          <p className="w-fit mt-[-0.93px] body-font">
            ${formatCurrency(subtotal)}
          </p>
        </div>

        {appliedCoupon && discount > 0 && (
          <div className="flex items-start gap-10 w-full">
            <p className="flex-1 mt-[-0.93px] body-font text-green-600">
              Descuento ({appliedCoupon.code})
            </p>
            <p className="w-fit mt-[-0.93px] body-font text-green-600">
              -${formatCurrency(discount)}
            </p>
          </div>
        )}

        <div className="flex items-start gap-10 w-full">
          <p className="flex-1 mt-[-0.93px] body-font">Envío</p>
          <p className="w-fit body-font font-bold">
            ${formatCurrency(deliveryFee)}
          </p>
        </div>

        <Separator orientation="horizontal" />

        <div className="flex items-center gap-10 w-full">
          <p className="flex-1 body-font font-bold">Total</p>
          <h2 className="w-fit mt-[-0.93px]">
            ${formatCurrency(total)}
          </h2>
        </div>
      </div>
    </div>
  );
};
