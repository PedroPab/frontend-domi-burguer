"use client";

import React from "react";
import { CheckoutFormProvider } from "@/contexts/CheckoutFormContext";

import { useCartSubmit } from "@/hooks/cart/useCartSubmit";

// Components
import { LoadingOverlay } from "@/components/cart/loadingOverlay";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { CartSummary } from "./CartSummary";
import { CartModals } from "@/components/cart/CartModals";

export default function Cart() {

  const { handleSubmitWithValidation, isSubmitting } = useCartSubmit();


  return (
    <CheckoutFormProvider>
      <form onSubmit={handleSubmitWithValidation}>
        <LoadingOverlay isLoading={isSubmitting} />

        <div className="flex flex-col xl:flex-row w-full xl:justify-around items-center xl:items-start gap-5 mt-[130px] lg:mt-[130px] mb-[100px]">
          {/* Formulario de checkout */}
          <CheckoutForm />

          {/* Resumen del pedido */}
          <CartSummary />

          {/* Todos los modales */}
          <CartModals />
        </div>
      </form>
    </CheckoutFormProvider>
  );
}