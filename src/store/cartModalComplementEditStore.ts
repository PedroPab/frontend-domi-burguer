import { create } from "zustand";
import { CartItem } from "@/store/cartStore";

interface CartModalsStore {
  // Complements Modal
  isModalComplementsOpen: boolean;
  selectedCartItem: CartItem | null;
  openComplementsModal: (item: CartItem) => void;
  closeComplementsModal: () => void;
}

export const useCartModalsStore = create<CartModalsStore>()((set) => ({
  // Complements Modal
  isModalComplementsOpen: false,
  selectedCartItem: null,
  openComplementsModal: (item) =>
    set({ isModalComplementsOpen: true, selectedCartItem: item }),
  closeComplementsModal: () =>
    set({ isModalComplementsOpen: false, selectedCartItem: null }),
}));
