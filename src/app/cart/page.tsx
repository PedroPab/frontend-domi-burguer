"use client";

import React, { useEffect } from "react";
import { CheckoutFormProvider } from "@/contexts/CheckoutFormContext";
import { useRouter } from "next/navigation";

import { useCartSubmit } from "@/hooks/cart/useCartSubmit";

// Components
import { LoadingOverlay } from "@/components/cart/loadingOverlay";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartModals } from "@/components/cart/CartModals";
import { useAuth } from "@/contexts/AuthContext";

export default function Cart() {

  const router = useRouter();
  const { handleSubmitWithValidation, isSubmitting, error } = useCartSubmit();
  useEffect(() => {
    console.log(error)
  }, [error])

  //revisamos si el cliente tiene un numero verificado en su cuenta de google si esta autenticado
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      console.log("User is authenticated:", user);
      if (user.phoneNumber) {
        console.log("User has a verified phone number:", user.phoneNumber);
      } else {
        console.log("User does not have a verified phone number.");
        //lo mandamos a verificar el telefono
        router.push("/verify-phone");
      }
    } else {
      console.log("No authenticated user.");
    }
  }, [user]);

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