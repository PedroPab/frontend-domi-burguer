"use client";

import React from "react";
import { Loader2, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code } from "@/types/codes";

interface CouponInputProps {
  couponCode: string;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon?: () => void;
  isLoading?: boolean;
  error?: string;
  appliedCoupon?: Code | null;
}

export const CouponInput = ({
  couponCode,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  isLoading = false,
  error,
  appliedCoupon,
}: CouponInputProps) => {
  if (appliedCoupon) {
    return (
      <div className="flex flex-col items-start gap-2 w-full">
        <p className="body-font font-bold text-neutral-black-80">
          Cupón de descuento
        </p>
        <div className="flex items-center gap-3 w-full mt-2 p-3 bg-green-50 border border-green-200 rounded-full">
          <Check className="w-5 h-5 text-green-600" />
          <span className="flex-1 font-medium text-green-700">
            {appliedCoupon.code}
          </span>
          {onRemoveCoupon && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onRemoveCoupon}
              className="w-8 h-8 rounded-full p-0 hover:bg-green-100"
            >
              <X className="w-4 h-4 text-green-600" />
            </Button>
          )}
        </div>
        {appliedCoupon.description && (
          <p className="text-green-600 text-sm">{appliedCoupon.description}</p>
        )}
      </div>
    );
  }

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
          onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (couponCode.trim() && !isLoading) {
                onApplyCoupon();
              }
            }
          }}
          className={`flex-1 bg-white ${error ? "border-red-400" : ""}`}
          disabled={isLoading}
        />
        <Button
          type="button"
          size="icon"
          onClick={onApplyCoupon}
          disabled={isLoading || !couponCode.trim()}
          className="w-10 h-10 rounded-full p-0 bg-accent-yellow-40 hover:bg-accent-yellow-60 text-neutral-black-80"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </Button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
