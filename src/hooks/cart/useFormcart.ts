import { useEffect, useState } from "react";
import { BancolombiaIcon, MoneyIcon, NequiIcon } from "@/components/ui/icons";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

type PaymentMethod = {
  id: string;
  label: string;
  iconClass: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
};

function useFormCart() {
  const router = useRouter();
  const { items, address, clearCart, getSubtotal, getTotal} = useCartStore();

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
    paymentMethod: "cash",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address && error === "Debes agregar una dirección de entrega") {
      setError(null);
    }
  }, [address, error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError(null);
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({ ...prev, phone: value || "" }));
    if (error) {
      setError(null);
    }
  };

  //   validacion de campos
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

  // objeto para enviar al backend
  const buildOrderPayload = () => {
    return {
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
        })),
      })),
      paymentMethod: formData.paymentMethod,
      origin: "public",
    };
  };

  /**
   * Maneja el envío de la orden al backend
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario enviado", formData);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = buildOrderPayload();

      console.log("Enviando orden:", orderPayload);

      // Aquí haces la petición al backend
      const response = await fetch(`${API_URL}api/v2/orders/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la orden");
      }

      const result = await response.json();

      console.log("Orden creada exitosamente:", result);

      const lastOrder = {
        name: formData.name,
        phone: formData.phone,
        comment: formData.comment,
        locationId: address?.id,
        address: address,
        orderItems: items,
        paymentMethod: formData.paymentMethod,
        prices: {
        subtotal: getSubtotal(),
        total: getTotal(),
      },
      };

      localStorage.setItem("lastOrder", JSON.stringify(lastOrder));

      // Limpiar carrito después de orden exitosa
      clearCart();

      // Redirigir a página de confirmación
      router.push("/thankyou");
    } catch (err) {
      console.error("Error al crear orden:", err);
      setError(
        err instanceof Error ? err.message : "Error al procesar la orden"
      );
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
