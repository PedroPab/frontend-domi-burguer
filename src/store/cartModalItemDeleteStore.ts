import { create } from "zustand";

interface ItemToDelete {
  id: string;
  name: string;
}

interface CartModalItemDeleteStore {
  isDeleteModalOpen: boolean;
  itemToDelete: ItemToDelete | null;
  openDeleteModal: (item: ItemToDelete) => void;
  closeDeleteModal: () => void;
}

export const useCartModalItemDeleteStore = create<CartModalItemDeleteStore>()(
  (set) => ({
    isDeleteModalOpen: false,
    itemToDelete: null,
    openDeleteModal: (item) =>
      set({ isDeleteModalOpen: true, itemToDelete: item }),
    closeDeleteModal: () =>
      set({ isDeleteModalOpen: false, itemToDelete: null }),
  })
);
