import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Address } from '@/types/address';

export const useAddressManagement = () => {
  const { address: addressStore, removeAddress } = useCartStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(
    addressStore
  );

  const handleEditAddress = () => {
    setAddressToEdit(addressStore);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAddressToEdit(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return {
    addressStore,
    isModalOpen,
    addressToEdit,
    handleEditAddress,
    handleCloseModal,
    handleOpenModal,
    removeAddress,
  };
};