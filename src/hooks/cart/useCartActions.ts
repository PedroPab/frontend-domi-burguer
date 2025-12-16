import { useState } from 'react';
import { useCartStore, CartItem } from '@/store/cartStore';

export const useCartActions = () => {
  const {
    items,
    updateQuantity,
    removeComplement,
    addItem,
  } = useCartStore();

  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity === 1) {
      const item = items.find((item) => item.id === id);
      if (item) {
        setItemToDelete({ id: item.id, name: item.name });
        setIsDeleteModalOpen(true);
      }
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      updateQuantity(itemToDelete.id, 0);
      setItemToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return {
    items,
    handleIncrease,
    handleDecrease,
    handleConfirmDelete,
    handleCloseDeleteModal,
    removeComplement,
    addItem,
    itemToDelete,
    isDeleteModalOpen,
  };
};