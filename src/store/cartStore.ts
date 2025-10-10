// store/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Address } from '@/types/address';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  complements?: { id: string; quantity: number}[];
}

interface CartStore {
  items: CartItem[];
  address: Address | null;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  setAddress: (address: Address) => void;
  clearCart: () => void;
  
  // Computed
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      address: null,

      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      })),

      setAddress: (address) => set({ address }),

      clearCart: () => set({ items: [], address: null }),

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const deliveryFee = 4400;
        return subtotal + deliveryFee;
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // nombre en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);