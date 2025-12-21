import { useCartModalsStore } from '@/store/cartModalComplementEditStore';
import { CartItem } from '@/store/cartStore';

export const useComplementsModal = () => {
  const {
    isModalComplementsOpen,
    selectedCartItem,
    openComplementsModal,
    closeComplementsModal,
  } = useCartModalsStore();

  const handleEditComplements = (item: CartItem) => {
    openComplementsModal(item);
  };

  const handleCloseComplementsModal = () => {
    closeComplementsModal();
  };

  return {
    isModalComplementsOpen,
    selectedCartItem,
    handleEditComplements,
    handleCloseComplementsModal,
  };
};