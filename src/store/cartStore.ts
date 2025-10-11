import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Address } from '@/types/address';
import { Complement } from '@/types/products';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number; // Precio total incluyendo complementos
  basePrice: number;
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

      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
        
        if (existingItem) {
          console.log(`Incrementando cantidad del item existente: ${item.name}`);
          return {
            items: state.items.map(i =>
              i.id === item.id 
                ? { ...i, quantity: i.quantity + item.quantity } 
                : i
            ),
          };
        }
        
        console.log(`Agregando nuevo item: ${item.name}`);
        return { items: [...state.items, item] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter(item => item.id !== id) };
        }
        return {
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        };
      }),

      setAddress: (address) => set({ address }),

      clearCart: () => set({ items: [], address: null }),

      getDeliveryFee: () => {
        const address = get().address;
        return address?.deliveryPrice || 4400;
      },

      getSubtotal: () => {
        const subtotal = get().items.reduce((sum, item) => {
          // price ya incluye complementos, solo multiplicar por cantidad
          return sum + (item.price * item.quantity);
        }, 0);
        
        console.log('Subtotal calculado:', subtotal);
        return subtotal;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const deliveryFee = get().getDeliveryFee();
        const total = subtotal + deliveryFee;
        
        console.log('Total calculado:', { subtotal, deliveryFee, total });
        return total;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
