"use client";

import React, { useEffect } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SpikesIcon } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
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

export const CartSummary = ({ }) => {
  // Context & Store
  const { getSubtotal, getTotal, getDeliveryFee, removeComplement } =
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

  // El hook useCartActions ahora maneja automáticamente la aplicación y re-aplicación
  // del reward del código cuando hay cambios en los items del carrito.
  // Solo necesitamos aplicar el código cuando se valida por primera vez.
  useEffect(() => {
    if (appliedCoupon) {
      console.log("Código aplicado:", appliedCoupon.code);
      addCodeInItems(appliedCoupon);
    }
  }, [addCodeInItems, appliedCoupon]);

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

              <Link href={"/"} className="w-full focus:outline-0! focus:ring-0!">
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  leftIcon={<Plus />}
                  className="w-full shadow-none"
                >
                  AGREGAR MÁS PRODUCTOS
                </Button>
              </Link>
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
