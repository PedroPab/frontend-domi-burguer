"use client";

import React from "react";
import { Plus, X, Check } from "lucide-react";
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
          Código de referido aplicado
        </p>
        <div className="flex items-center gap-3 w-full mt-2 p-3 bg-green-50 border border-green-200 rounded-full">
          <Check className="w-5 h-5 text-green-600" />
          <span className="flex-1 font-medium text-green-700">
            {appliedCoupon.code}
          </span>
          {onRemoveCoupon && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onRemoveCoupon}
              className="hover:bg-green-100"
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
        Código de referido
      </p>
      <p className="body-font text-neutral-black-60 text-sm">
        Ingresa tu código de referido y recibe papas gratis en tu primer pedido
      </p>

      <div className="flex items-center gap-3 w-full mt-2">
        <Input
          type="text"
          placeholder="Ingresa el código"
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
          onBlur={() => {
            if (couponCode.trim() && !isLoading) {
              onApplyCoupon();
            }
          }}
          className={`flex-1 bg-white ${error ? "border-red-400" : ""}`}
          disabled={isLoading}
        />
        <Button
          type="button"
          variant="yellow"
          size="icon"
          onClick={onApplyCoupon}
          disabled={!couponCode.trim()}
          loading={isLoading}
          leftIcon={!isLoading ? <Plus className="w-5 h-5" /> : undefined}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
