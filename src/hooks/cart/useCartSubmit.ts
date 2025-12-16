import { useState } from 'react';
import { useStoreHours } from '@/hooks/useStoreHours';
import useFormCart from '@/hooks/cart/useFormcart';

export const useCartSubmit = () => {
  const storeStatus = useStoreHours();
  const {
    formData,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    paymentMethods,
    isSubmitting,
    error,
  } = useFormCart();

  const [isStoreClosedModalOpen, setIsStoreClosedModalOpen] = useState(false);

  const handleSubmitWithValidation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!storeStatus.isOpen) {
      setIsStoreClosedModalOpen(true);
      return;
    }

    await handleSubmit(e);
  };

  const handleCloseStoreModal = () => {
    setIsStoreClosedModalOpen(false);
  };

  return {
    formData,
    handleChange,
    handlePhoneChange,
    handleSubmitWithValidation,
    paymentMethods,
    isSubmitting,
    error,
    storeStatus,
    isStoreClosedModalOpen,
    handleCloseStoreModal,
  };
};