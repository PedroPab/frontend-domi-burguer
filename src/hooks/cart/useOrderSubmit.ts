import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "@/store/cartStore";
import { useCheckoutFormStore } from "@/store/checkoutFormStore";
import { Address } from "@/types/address";
import { OrderPayload } from "@/types/OrderPayload";

interface LastOrder {
  name: string;
  phone: string;
  comment: string;
  locationId: number | undefined;
  address: Address | null;
  orderItems: CartItem[];
  paymentMethod: string;
  prices: {
    subtotal: number;
    total: number;
  };
}

interface OrderResult {
  [key: string]: unknown;
}

export const useOrderSubmit = (
  onSuccess: (result: OrderResult) => void,
  onError: (error: Error) => void
) => {
  // const router = useRouter();
  // const { items, address, clearCart, getSubtotal, getTotal } = useCartStore();
  // const { formData, resetForm } = useCheckoutFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;


  // const saveLastOrder = (): void => {
  //   const lastOrder: LastOrder = {
  //     name: formData.name,
  //     phone: formData.phone,
  //     comment: formData.comment,
  //     locationId: address?.id,
  //     address: address,
  //     orderItems: items,
  //     paymentMethod: formData.paymentMethod,
  //     prices: {
  //       subtotal: getSubtotal(),
  //       total: getTotal(),
  //     },
  //   };
  //   localStorage.setItem("lastOrder", JSON.stringify(lastOrder));
  // };

  const submitOrder = async ({ token, orderPayload }: { token?: string, orderPayload?: OrderPayload }): Promise<OrderResult> => {
    setIsSubmitting(true);
    setError(null);

    try {

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      let url = `${API_URL}api/v2/orders/public`
      const body = orderPayload
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
        url = `${API_URL}api/v2/orders/`;
        if (body) {
          delete (body as Partial<OrderPayload>).phone;
          delete (body as Partial<OrderPayload>).name;
        }
      }
      options.body = JSON.stringify(body);

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la orden");
      }

      const result: OrderResult = await response.json();
      const order = result.body;
      // Guardar última orden en localStorage
      // saveLastOrder();

      // Limpiar carrito y formulario
      // clearCart();
      // resetForm();

      // Callback de éxito
      onSuccess(order);

      // Redirigir a página de confirmación
      // router.push("/thankyou");

      return order;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la orden";
      setError(errorMessage);
      onError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOrder,
    isSubmitting,
    error,
    setError,
  };
};
