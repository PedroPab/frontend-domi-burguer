import { useEffect } from "react";
import { BancolombiaIcon, MoneyIcon, NequiIcon } from "@/components/ui/icons";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutFormStore } from "@/store/checkoutFormStore";
import { useOrderSubmit } from "@/hooks/cart/useOrderSubmit";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentMethod } from "@/types/paymentMethod";
import { OrderPayload } from "@/types/OrderPayload";
import { Address } from "@/types/address";
import { useRouter } from "next/navigation";


function useFormCart() {
  const { items, address } = useCartStore();
  const { formData, setFormData, setFormField, error, setError } = useCheckoutFormStore();
  const { resetForm } = useCheckoutFormStore();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const { submitOrder, isSubmitting } = useOrderSubmit(
  (result) => {
      console.log("Order submitted successfully:", result);
      //guardar la última orden en el almacenamiento local
    // saveLastOrder();

      // Limpiar carrito y formulario
      clearCart();
      resetForm();

      // Redirigir a la página de confirmación o mostrar mensaje de éxito
      router.push("/thankyou");
    },
    (error) => {
      console.error("Error submitting order:", error);
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



  const buildOrderPayload = ({formData, address , items} : {formData: any, address: Address, items: any[]}): OrderPayload => {
    return {
      name: formData.name,
      phone: formData.phone,
      comment: formData.comment,
      locationId: address?.id,
      userId: user?.uid || null,
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
      // origin: user ? "authenticated" : "public",
    };
  };

  // Maneja el envío de la orden
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
     const orderPayload = buildOrderPayload({formData, address , items});

     const token = await user?.getIdToken();
    await submitOrder({ orderPayload, token  });
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
