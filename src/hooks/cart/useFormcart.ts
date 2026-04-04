import { useEffect } from "react";
import { BancolombiaIcon, MoneyIcon, NequiIcon } from "@/components/ui/icons";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutFormStore } from "@/store/checkoutFormStore";
import { useAppliedCodeStore } from "@/store/appliedCodeStore";
import { useOrderSubmit } from "@/hooks/cart/useOrderSubmit";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentMethod } from "@/types/paymentMethod";
import { OrderPayload } from "@/types/OrderPayload";
import { Address } from "@/types/address";
import { useRouter } from "next/navigation";


function useFormCart() {
  const { items, address, getSubtotal, getTotal } = useCartStore();
  const { formData, setFormData, setFormField, error, setError, isSubmitting, setIsSubmitting } = useCheckoutFormStore();
  const { resetForm } = useCheckoutFormStore();
  const { clearCart } = useCartStore();
  const { clearAll: clearAppliedCode } = useAppliedCodeStore();
  const router = useRouter();
  const { submitOrder } = useOrderSubmit(
    (result) => {
      console.log("Order submitted successfully:", result);

      // Guardar última orden en localStorage ANTES de limpiar
      const lastOrder = {
        name: formData.name,
        phone: formData.phone,
        comment: formData.comment,
        address: address,
        orderItems: items,
        paymentMethod: formData.paymentMethod,
        prices: {
          subtotal: getSubtotal(),
          total: getTotal(),
        },
      };
      localStorage.setItem("lastOrder", JSON.stringify(lastOrder));

      // Limpiar carrito, formulario y código aplicado
      clearCart();
      resetForm();
      clearAppliedCode();

      // Redirigir a la página de confirmación
      router.push("/thankyou");
    },
    (apiError) => {
      console.error("Error submitting order:", apiError);
      setError(apiError.message || "Error al procesar la orden");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  );
  const { user } = useAuth();

  const paymentMethods: PaymentMethod[] = [
    {
      id: "cash",
      label: "Efectivo",
      iconClass: "w-[38px] h-[32px]",
      icon: MoneyIcon,
      selected: true,
    },
    {
      id: "bancolombia",
      label: "Bancolombia",
      iconClass: "w-[28px] h-[28px]",
      icon: BancolombiaIcon,
      selected: false,
    },
    {
      id: "nequi",
      label: "Nequi",
      iconClass: "w-[36px] h-[25px]",
      icon: NequiIcon,
      selected: false,
    },
  ];

  // Actualizar el formulario con los datos del usuario cuando se autentica
  useEffect(() => {
    if (user) {
      console.log("Filling form with user data:", {
        name: user.displayName,
        phone: user.phoneNumber
      });
      setFormData({
        name: user.displayName || "",
        phone: user.phoneNumber || ""
      });
    }
  }, [user, setFormData]);

  useEffect(() => {
    if (address && error === "Debes agregar una dirección de entrega") {
      setError(null);
    }
  }, [address, error, setError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormField(name as keyof typeof formData, value);
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormField("phone", value || "");
  };

  // Validación de campos
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    if (!formData.phone.trim()) {
      setError("El teléfono es requerido");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    if (items.length === 0) {
      setError("El carrito está vacío");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    if (!address || !address.coordinates) {
      setError("Debes agregar una dirección de entrega");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    setError(null);
    return true;
  };


  interface BuildOrderPayloadParams {
    formData: typeof formData;
    address: Address;
    items: typeof items;
  }
  const buildOrderPayload = ({ formData, address, items }: BuildOrderPayloadParams): OrderPayload => {
    const orderPayload: OrderPayload = {
      name: formData.name,
      phone: formData.phone,
      comment: formData.comment,
      locationId: address?.id,
      delivery: {
        price: address?.deliveryPrice || 0,
        distance: address?.distance || 0,
      },
      orderItems: items.map((item) => ({
        id: item.productId.toString(),
        quantity: item.quantity,
        complements: item.complements.map((comp) => ({
          id: comp.id.toString(),
          quantity: comp.quantity,
          ...(comp?.rewardCode ? { codes: [comp.rewardCode] } : {}),
        })),
      })),
      paymentMethod: formData.paymentMethod,
      // origin: user ? "authenticated" : "public",
    };
    if (user) {
      orderPayload.userId = user.uid;
    }
    console.log("Built order payload:", orderPayload);
    return orderPayload;
  };

  // Maneja el envío de la orden
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    if (!address) {
      setError("Debes agregar una dirección de entrega");
      return;
    }

    const orderPayload = buildOrderPayload({ formData, address, items });

    const token = await user?.getIdToken();
    console.log(orderPayload, "Submitting order with token:");

    setIsSubmitting(true);
    try {
      await submitOrder({ orderPayload, token });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    handlePhoneChange,
    paymentMethods,
    isSubmitting,
    error,
    validateForm,
  };
}

export default useFormCart;
