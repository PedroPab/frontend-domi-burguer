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
} from "../ui/icons";
import { QuantitySelector } from "../ui/quantitySelector";
export interface Complement {
  id: number;
  name?: string;
  quantity: number;
  icon?: React.FC<any>;
  price?: string | null;
  type?: "removable" | "special" | "addable";
  additionId?: number; 
  minusId?: number;
}

const ingredientsData: Complement[] = [
  {
    id: 4,
    name: "Carne",
    price: "+$6.000",
    icon: CarneIcon,
    quantity: 1,
    type: "special",
    additionId: 100,
    minusId: 101,
  },
  {
    id: 14,
    name: "Lechuga",
    price: null,
    icon: LechugaIcon,
    quantity: 1,
    type: "removable",
  },
  {
    id: 30,
    name: "Tomate",
    price: null,
    icon: TomateIcon,
    quantity: 1,
    type: "removable",
  },
  {
    id: 6,
    name: "Tocineta",
    price: "+$3.500",
    icon: TocinetaIcon,
    quantity: 1,
    type: "removable",
  },
  {
    id: 13,
    name: "Pepinillos",
    price: null,
    icon: PicklesIcon,
    quantity: 1,
    type: "removable",
  },
  {
    id: 15,
    name: "Salsas",
    price: null,
    icon: SouceIcon,
    quantity: 1,
    type: "removable",
  },
  {
    id: 24,
    name: "Queso americano",
    price: "+$2.000",
    icon: QuesoIcon,
    quantity: 1,
    type: "removable",
  },
  {
    id: 7,
    name: "Papas rizadas",
    price: "+$6.800",
    icon: FrenchFriesIcon,
    quantity: 0,
    type: "addable",
    additionId: 7,
  },
];

interface CustomizationModalSectionProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productId?: number;
  handleChangeComplement: (ingredient: Complement, action: "plus" | "minus") => void;
  complements?: Complement[];
}

export const CustomizationModalSection = ({
  isOpen,
  onClose,
  productName = "BURGER",
  handleChangeComplement,
  complements = [],
}: CustomizationModalSectionProps) => {
  const [ingredients, setIngredients] = useState<Complement[]>(ingredientsData);

  // Sincronizar ingredientes con complementos guardados cuando abre el modal
  useEffect(() => {
    if (isOpen) {
      setIngredients((prev) =>
        prev.map((ing) => {
          // Para ingredientes SPECIAL
          if (ing.type === "special") {
            // Buscar complemento "Vegetariano" (minusId)
            const hasVegetariano = complements.some((c) => c.id === ing.minusId);
            if (hasVegetariano) {
              return { ...ing, quantity: 0 };
            }

            // Buscar complemento "Adición de X" (additionId)
            const adicion = complements.find((c) => c.id === ing.additionId);
            if (adicion) {
              // Cantidad = 1 (base) + cantidad de adición
              return { ...ing, quantity: 1 + adicion.quantity };
            }

            // Si no hay complementos, es cantidad 1 (default)
            return { ...ing, quantity: 1 };
          }

          // Para ingredientes REMOVABLE
          if (ing.type === "removable") {
            // Buscar complemento "Sin X" (mismo ID del ingrediente)
            const hasSinIngrediente = complements.some((c) => 
              c.id === ing.id && c.name?.startsWith("Sin ")
            );
            
            if (hasSinIngrediente) {
              return { ...ing, quantity: 0 };
            }

            // Si no hay complemento "Sin X", está presente (cantidad 1)
            return { ...ing, quantity: 1 };
          }

          return ing;
        })
      );
    }
  }, [complements, isOpen]);

  // Manejo del botón "atrás" del navegador
  useEffect(() => {
    const handlePopState = () => onClose();

    if (isOpen) {
      window.history.pushState({ modalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else {
      if (window.history.state?.modalOpen) window.history.back();
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
    // Para removable en cantidad 1, no permitir aumentar
    if (action === 'plus' && ingredient.type === 'removable' && ingredient.quantity >= 1) {
      return;
    }

    // Para special y removable en cantidad 0, no permitir disminuir más
    if (action === 'minus' && ingredient.quantity <= 0) {
      return;
    }

    // Calcular nueva cantidad
    const newQuantity = action === 'plus' 
      ? ingredient.quantity + 1 
      : ingredient.quantity - 1;

    // Actualizar cantidad visual del ingrediente
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredient.id ? { ...i, quantity: newQuantity } : i
      )
    );

    // Pasar el ingrediente con la cantidad ACTUAL (antes del cambio)
    handleChangeComplement(ingredient, action);
  };

  /**
   * Resetea todos los ingredientes y complementos
   */
  const handleReset = () => {
    setIngredients(ingredientsData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-background rounded-2xl z-500">
        <DialogHeader className="p-10 pb-0">
          <DialogTitle className="font-bold text-[16px] md:text-[20px] text-center leading-[18px] md:leading-[22px] text-neutral-black-80">
            ¿QUIERES PERSONALIZAR TU {productName}?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-10 pb-10">
          {/* Lista de ingredientes */}
          <div className="flex flex-col">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex h-12 items-center gap-4 py-3 rounded-xl"
              >
                {ingredient.icon && <ingredient.icon />}
                
                <div className="flex-1 font-medium text-sm leading-4">
                  <span className="text-[#313131]">{ingredient.name}</span>
                  {ingredient.price && (
                    <span className="text-[#808080]">
                      {" "}
                      ({ingredient.price})
                    </span>
                  )}
                </div>
                
                <QuantitySelector
                  value={ingredient.quantity}
                  onIncrease={() => handleIngredientChange(ingredient, "plus")}
                  onDecrease={() => handleIngredientChange(ingredient, "minus")}
                  size="sm"
                />
              </div>
            ))}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="bg-accent-yellow-40 hover:bg-accent-yellow-60 rounded-[30px] w-[133px] h-[48px]"
              onClick={() => {
                handleReset();
                onClose();
              }}
            >
              CANCELAR
            </Button>
            <Button 
              className="text-white rounded-[30px] w-[133px] h-[48px]"
              onClick={onClose}
            >
              CONFIRMAR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};