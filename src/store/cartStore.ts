import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Address } from "@/types/address";
import { Complement } from "@/types/products";
import { generateCartItemId, calculateTotalPrice } from "@/lib/utils";

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number; // Precio total incluyendo complementos
  basePrice: number; // Precio base sin complementos
  quantity: number;
  image1: string;
  image2?: string | null;
  complements: Complement[];
}

interface CartStore {
  items: CartItem[];
  address: Address | null;

  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeComplement: (itemId: string, complementId: number) => void;
  setAddress: (address: Address) => void;
  clearCart: () => void;

  // Computed - Mejorados
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
  getDeliveryFee: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      address: null,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            console.log(
              `Incrementando cantidad del item existente: ${item.name}`
            );
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          console.log(`Agregando nuevo item: ${item.name}`);
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        }),

      removeComplement: (itemId, complementId) =>
        set((state) => {
          const itemIndex = state.items.findIndex((i) => i.id === itemId);
          if (itemIndex === -1) return state;

          const itemToRemoveFrom = state.items[itemIndex];

          const updatedComplements = itemToRemoveFrom.complements.filter(
            (c) => c.id !== complementId
          );
          const newPrice = calculateTotalPrice(
            itemToRemoveFrom.basePrice,
            updatedComplements
          );
          const newId = generateCartItemId(
            itemToRemoveFrom.productId,
            updatedComplements
          );

          const existingItemIndex = state.items.findIndex(
            (i, index) => i.id === newId && index !== itemIndex
          );

          const newItems = [...state.items];

          if (existingItemIndex !== -1) {
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity:
                newItems[existingItemIndex].quantity +
                itemToRemoveFrom.quantity,
            };
            newItems.splice(itemIndex, 1);
          } else {
            newItems[itemIndex] = {
              ...itemToRemoveFrom,
              id: newId,
              complements: updatedComplements,
              price: newPrice,
            };
          }

          return { items: newItems };
        }),

      setAddress: (address) => set({ address }),

      clearCart: () => set({ items: [], address: null }),

      getDeliveryFee: () => {
        const address = get().address;
        return address?.deliveryPrice || 0;
      },

      getSubtotal: () => {
        const subtotal = get().items.reduce((sum, item) => {
          return sum + item.price * item.quantity;
        }, 0);

        return subtotal;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const deliveryFee = get().getDeliveryFee();
        const total = subtotal + deliveryFee;

        return total;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
