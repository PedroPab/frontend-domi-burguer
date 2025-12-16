import { useState } from 'react';
import { CartItem } from '@/store/cartStore';

export const useComplementsModal = () => {
  const [isModalComplementsOpen, setIsModalComplementsOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);

  const handleEditComplements = (item: CartItem) => {
    setSelectedCartItem(item);
    setIsModalComplementsOpen(true);
  };

  const handleCloseComplementsModal = () => {
    setIsModalComplementsOpen(false);
    setSelectedCartItem(null);
  };

  return {
    isModalComplementsOpen,
    selectedCartItem,
    handleEditComplements,
    handleCloseComplementsModal,
  };
};