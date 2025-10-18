import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CarneIcon,
  FrenchFriesIcon,
  LechugaIcon,
  PicklesIcon,
  QuesoIcon,
  SouceIcon,
  TocinetaIcon,
  TomateIcon,
  LogoProps,
} from "../ui/icons";
import { QuantitySelector } from "../ui/quantitySelector";
import { Complement } from "@/types/products";
import { useCartStore, CartItem } from "@/store/cartStore";

const iconMap: { [key: string]: React.FC<LogoProps> } = {
  CarneIcon,
  FrenchFriesIcon,
  LechugaIcon,
  PicklesIcon,
  QuesoIcon,
  SouceIcon,
  TocinetaIcon,
  TomateIcon,
};

const ingredientsData: Complement[] = [
  {
    id: 1002,
    name: "Carne",
    price: 6000,
    icon: "CarneIcon",
    quantity: 1,
    type: "special",
    additionId: 4,
    minusId: 20,
    minusComplement: false,
  },
  {
    id: 14,
    name: "Lechuga",
    price: null,
    icon: "LechugaIcon",
    quantity: 1,
    type: "removable",
    minusComplement: true,
  },
  {
    id: 300,
    name: "Tomate",
    price: null,
    icon: "TomateIcon",
    quantity: 1,
    type: "special",
    additionId: 30,
    minusId: 12,
    minusComplement: false,
  },
  {
    id: 666,
    name: "Tocineta",
    price: 3500,
    icon: "TocinetaIcon",
    quantity: 1,
    type: "special",
    additionId: 6,
    minusId: 18,
    minusComplement: false,
  },
  {
    id: 288,
    name: "Pepinillos",
    price: null,
    icon: "PicklesIcon",
    quantity: 1,
    type: "special",
    additionId: 28,
    minusId: 13,
    minusComplement: false,
  },
  {
    id: 15,
    name: "Salsas",
    price: null,
    icon: "SouceIcon",
    quantity: 1,
    type: "removable",
    minusComplement: true,
  },
  {
    id: 244,
    name: "Queso americano",
    price: 2000,
    icon: "QuesoIcon",
    quantity: 1,
    type: "special",
    additionId: 5,
    minusId: 24,
    minusComplement: false,
  },
  {
    id: 7,
    name: "Papas rizadas",
    price: 6800,
    icon: "FrenchFriesIcon",
    quantity: 0,
    type: "addable",
    additionId: 7,
    minusComplement: false,
  },
];

interface CustomizationModalCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItem: CartItem;
}

export const CustomizationModalCart = ({
  isOpen,
  onClose,
  cartItem,
}: CustomizationModalCartProps) => {
  const [ingredients, setIngredients] = useState<Complement[]>(ingredientsData);
  const { updateItemComplements } = useCartStore();

  // Sincronizar ingredientes con los complementos del item del carrito
  useEffect(() => {
    if (isOpen && cartItem) {
      setIngredients((prev) =>
        prev.map((ing) => {
          // Para ingredientes SPECIAL
          if (ing.type === "special") {
            const hasVegetariano = cartItem.complements.some(
              (c) => c.id === ing.minusId
            );
            if (hasVegetariano) {
              return { ...ing, quantity: 0 };
            }

            const adicion = cartItem.complements.find(
              (c) => c.id === ing.additionId
            );
            if (adicion) {
              return { ...ing, quantity: 1 + adicion.quantity };
            }

            return { ...ing, quantity: 1 };
          }

          // Para ingredientes ADDABLE
          if (ing.type === "addable") {
            const isComboEspecial = cartItem.productId === 1;
            const adicion = cartItem.complements.find(
              (c) => c.id === ing.additionId
            );
            const aditionQty = adicion ? adicion.quantity : 0;

            if (isComboEspecial) {
              return { ...ing, quantity: 1 + aditionQty };
            } else {
              return { ...ing, quantity: aditionQty };
            }
          }

          // Para ingredientes REMOVABLE
          if (ing.type === "removable") {
            const hasSinIngrediente = cartItem.complements.some(
              (c) => c.id === ing.id
            );

            if (hasSinIngrediente) {
              return { ...ing, quantity: 0 };
            }

            return { ...ing, quantity: 1 };
          }

          return ing;
        })
      );
    }
  }, [cartItem, isOpen]);

  // Manejo del botón "atrás" del navegador
  useEffect(() => {
    const handlePopState = () => onClose();

    if (isOpen) {
      window.history.pushState({ complementsModalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else {
      if (window.history.state?.complementsModalOpen) {
        window.history.back();
      }
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, onClose]);

  /**
   * Maneja los cambios en la cantidad de un ingrediente
   */
  const handleIngredientChange = (
    ingredient: Complement,
    action: "plus" | "minus"
  ) => {
    if (
      action === "plus" &&
      ingredient.type === "removable" &&
      ingredient.quantity >= 1
    ) {
      return;
    }

    if (action === "minus" && ingredient.quantity <= 0) {
      return;
    }

    const newQuantity =
      action === "plus" ? ingredient.quantity + 1 : ingredient.quantity - 1;

    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredient.id ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  /**
   * Convierte el estado actual de ingredientes a complementos
   */
  const convertIngredientsToComplements = (): Complement[] => {
    const complements: Complement[] = [];

    ingredients.forEach((ing) => {
      if (ing.type === "special") {
        // Si quantity es 0, agregar complemento "Vegetariano/Sin X"
        if (ing.quantity === 0 && ing.minusId) {
          complements.push({
            ...ing,
            id: ing.minusId,
            minusComplement: true,
            quantity: 1,
            price: 0,
          });
        }
        // Si quantity > 1, agregar complemento de "Adición"
        else if (ing.quantity > 1 && ing.additionId) {
          const { additionId, minusId, ...rest } = ing;
          complements.push({
            ...rest,
            id: ing.additionId,
            minusComplement: false,
            quantity: ing.quantity - 1,
          });
        }
      } else if (ing.type === "addable") {
        const isComboEspecial = cartItem.productId === 1;

        if (isComboEspecial) {
          // En combo especial, solo agregar si quantity > 1
          if (ing.quantity > 1 && ing.additionId) {
            const { additionId, minusId, ...rest } = ing;
            complements.push({
              ...rest,
              id: ing.additionId,
              minusComplement: false,
              quantity: ing.quantity - 1,
            });
          }
        } else {
          // En otros productos, agregar si quantity > 0
          if (ing.quantity > 0 && ing.additionId) {
            const { additionId, minusId, ...rest } = ing;
            complements.push({
              ...rest,
              id: ing.additionId,
              minusComplement: false,
              quantity: ing.quantity,
            });
          }
        }
      } else if (ing.type === "removable") {
        // Si quantity es 0, agregar complemento "Sin X"
        if (ing.quantity === 0) {
          complements.push({
            ...ing,
            id: ing.id,
            minusComplement: true,
            quantity: 1,
            price: 0,
          });
        }
      }
    });

    return complements;
  };

  /**
   * Confirma los cambios y actualiza el item en el carrito
   */
  const handleConfirm = () => {
    const newComplements = convertIngredientsToComplements();
    updateItemComplements(cartItem.id, newComplements);
    onClose();
  };

  /**
   * Cancela y cierra el modal
   */
  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-background rounded-2xl z-500">
        <DialogHeader className="p-10 pb-0">
          <DialogTitle className="font-bold text-[16px] md:text-[20px] text-center leading-[18px] md:leading-[22px] text-neutral-black-80">
            ¿QUIERES PERSONALIZAR TU {cartItem?.name}?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-10 pb-10">
          {/* Lista de ingredientes */}
          <div className="flex flex-col">
            {ingredients.map((ingredient) => {
              const IconComponent = ingredient.icon
                ? iconMap[ingredient.icon]
                : null;
              return (
                <div
                  key={ingredient.id}
                  className="flex h-12 items-center gap-4 py-3 rounded-xl"
                >
                  {IconComponent && <IconComponent />}

                  <div className="flex-1 font-medium text-sm leading-4">
                    <span className="text-[#313131]">{ingredient.name}</span>
                    {ingredient.price && (
                      <span className="text-[#808080]">
                        {" "}
                        (+${ingredient.price})
                      </span>
                    )}
                  </div>

                  <QuantitySelector
                    value={ingredient.quantity}
                    onIncrease={() =>
                      handleIngredientChange(ingredient, "plus")
                    }
                    onDecrease={() =>
                      handleIngredientChange(ingredient, "minus")
                    }
                    size="sm"
                  />
                </div>
              );
            })}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="bg-accent-yellow-40 hover:bg-accent-yellow-60 rounded-[30px] w-[133px] h-[48px]"
              onClick={handleCancel}
            >
              CANCELAR
            </Button>
            <Button
              className="text-white rounded-[30px] w-[133px] h-[48px]"
              onClick={handleConfirm}
            >
              CONFIRMAR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};