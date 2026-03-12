"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CouponInputProps {
  couponCode: string;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  isLoading?: boolean;
  error?: string;
}

export const CouponInput = ({
  couponCode,
  onCouponChange,
  onApplyCoupon,
  isLoading = false,
  error,
}: CouponInputProps) => {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <p className="body-font font-bold text-neutral-black-80">
        Cupón de descuento
      </p>
      <p className="body-font text-neutral-black-60 text-sm">
        Ingresa tu código de descuento
      </p>

      <div className="flex items-center gap-3 w-full mt-2">
        <Input
          type="text"
          placeholder="Ingresa el cupón"
          value={couponCode}
          onChange={(e) => onCouponChange(e.target.value)}
          className="flex-1 bg-white"
        />
        <Button
          type="button"
          size="icon"
          onClick={onApplyCoupon}
          disabled={isLoading || !couponCode.trim()}
          className="w-10 h-10 rounded-full p-0 bg-accent-yellow-40 hover:bg-accent-yellow-60 text-neutral-black-80"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
