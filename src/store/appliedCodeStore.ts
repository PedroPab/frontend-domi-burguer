import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Code } from "@/types/codes";

interface AppliedCodeStore {
  // El código aplicado validado (persiste incluso si se eliminan productos)
  appliedCode: Code | null;

  // Indica si el regalo del código ya fue aplicado a algún producto del carrito
  isRewardApplied: boolean;

  // Guardar un código validado
  setAppliedCode: (code: Code) => void;

  // Eliminar el código aplicado (cuando el usuario lo remueve manualmente)
  removeAppliedCode: () => void;

  // Marcar que el reward ya fue aplicado a un producto
  setRewardApplied: (applied: boolean) => void;

  // Limpiar todo (después de completar una orden)
  clearAll: () => void;
}

export const useAppliedCodeStore = create<AppliedCodeStore>()(
  persist(
    (set) => ({
      appliedCode: null,
      isRewardApplied: false,

      setAppliedCode: (code) =>
        set({
          appliedCode: code,
          isRewardApplied: false, // Reset cuando se aplica un nuevo código
        }),

      removeAppliedCode: () =>
        set({
          appliedCode: null,
          isRewardApplied: false,
        }),

      setRewardApplied: (applied) =>
        set({
          isRewardApplied: applied,
        }),

      clearAll: () =>
        set({
          appliedCode: null,
          isRewardApplied: false,
        }),
    }),
    {
      name: "applied-code-storage-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
