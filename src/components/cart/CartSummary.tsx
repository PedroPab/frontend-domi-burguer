"use client";

import React, { useEffect } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SpikesIcon } from "@/components/ui/icons";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CartItem, useCartStore } from "@/store/cartStore";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import { useCartActions } from "@/hooks/cart/useCartActions";
import { useCartSubmit } from "@/hooks/cart/useCartSubmit";
import { useComplementsModal } from "@/hooks/cart/useComplementsModal";
import { useCoupon } from "@/hooks/cart/useCoupon";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CouponInput } from "@/components/cart/CouponInput";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { ErrorCard } from "@/components/cart/ErrorCard";
import { useCheckoutFormStore } from "@/store/checkoutFormStore";

export const CartSummary = ({}) => {
  // Context & Store
  const { getSubtotal, getTotal, getDeliveryFee, removeComplement, addItem } =
    useCartStore();
  const {
    items,
    handleDecrease,
    handleIncrease,
    addCodeInItems,
    removeCodeFromItems,
  } = useCartActions();

  const { handleEditComplements } = useComplementsModal();
  const { isSubmitting, error } = useCartSubmit();
  const { setError } = useCheckoutFormStore();

  const {
    couponCode,
    setCouponCode,
    appliedCoupon,
    isLoading: isCouponLoading,
    error: couponError,
    applyCoupon,
    removeCoupon,
  } = useCoupon();

  useEffect(() => {
    console.log("appliedCoupon:", appliedCoupon);
    //debemos agregar el producto o complemento al agregar el codigo
    if (appliedCoupon) addCodeInItems(appliedCoupon);
  }, [addCodeInItems, appliedCoupon]);

  //cuando se remueve el cupón, debemos de activar la función que remueve el complemento asociado al código de referido
  useEffect(() => {
    if (!appliedCoupon) {
      console.log(
        "Cupón removido, verificando si es un código de referido para eliminar complemento asociado",
      );
      if (couponCode) {
        console.log("Código de cupón previo:", couponCode);
        // Aquí podríamos verificar si el código removido era un código de referido y eliminar el complemento asociado
        // Esto depende de cómo estés manejando la relación entre códigos y complementos en tu lógica
      }
    }
  }, [appliedCoupon, couponCode]);

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
                    size="sm"
                    rightIcon={<CalendarIcon className="w-[15px] h-[15px]" />}
                    disabled={true}
                    className="bg-accent-yellow-10 h-auto"
                  >
                    PROGRAMAR
                  </Button>
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-col items-start gap-8 w-full">
              <div className="flex flex-col items-start gap-4 w-full">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onEditComplements={handleEditComplements}
                    onRemoveComplement={removeComplement}
                    onDecrease={handleDecrease}
                    onIncrease={handleIncrease}
                  />
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
                          variant="primary"
                          size="lg"
                          leftIcon={<Plus />}
                          className="w-[260px] mt-4 shadow-none"
                        >
                          AGREGAR PRODUCTOS
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <Separator orientation="horizontal" className="w-full!" />

              {!items.some((item) =>
                item.name.toLowerCase().includes("salsa"),
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
                            variant="primary"
                            size="icon"
                            onClick={() => {
                              const salsaItem: CartItem = {
                                id: "product-38",
                                productId: 38,
                                name: "SALSA DE AJO DE LA CASA",
                                price: 27000,
                                basePrice: 27000,
                                quantity: 1,
                                image1: "/salsaSmall.png",
                                complements: [],
                                allowCustomization: false,
                                customizationType: "none",
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
              <CouponInput
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={() => {
                  if (appliedCoupon) removeCodeFromItems(appliedCoupon);

                  removeCoupon();
                }}
                isLoading={isCouponLoading}
                error={couponError ?? undefined}
                appliedCoupon={appliedCoupon}
              />

              <OrderTotals
                subtotal={getSubtotal()}
                deliveryFee={getDeliveryFee()}
                items={items}
                total={getTotal()}
                appliedCoupon={appliedCoupon}
              />

              {error && (
                <ErrorCard error={error} onClose={() => setError(null)} />
              )}

              <div className="flex items-start justify-end gap-6 w-full">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={items.length === 0}
                  loading={isSubmitting}
                  loadingText="ENVIANDO..."
                  className="min-w-[128px]"
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
