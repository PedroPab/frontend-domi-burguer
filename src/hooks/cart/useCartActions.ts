import { useCartStore } from '@/store/cartStore';
import { useCartModalItemDeleteStore } from '@/store/cartModalItemDeleteStore';

export const useCartActions = () => {
  const {
    items,
    updateQuantity,
    removeComplement,
    addItem,
  } = useCartStore();

  const {
    itemToDelete,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
  } = useCartModalItemDeleteStore();

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity === 1) {
      const item = items.find((item) => item.id === id);
      if (item) {
        openDeleteModal({ id: item.id, name: item.name });
      }
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      updateQuantity(itemToDelete.id, 0);
      closeDeleteModal();
    }
  };

  const handleCloseDeleteModal = () => {
    closeDeleteModal();
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