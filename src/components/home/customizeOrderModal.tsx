import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuantitySelector } from "../ui/quantitySelector";
import { Complement } from "@/types/products";
import { favoritosData, otrosData, gaseosasData, iconMap } from "@/utils/complementSections";

import { ChevronDown, ChevronUp } from "lucide-react";



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
  productId,
  handleChangeComplement,
  complements = [],
}: CustomizationModalSectionProps) => {
  const [favoritos, setFavoritos] = useState<Complement[]>(favoritosData);
  const [otros, setOtros] = useState<Complement[]>(otrosData);
  const [gaseosas, setGaseosas] = useState<Complement[]>(gaseosasData);
  console.log("COMPLEMENTOS EN MODAL:", complements, gaseosas);

  // Estados de los acordeones
  const [isFavoritosOpen, setIsFavoritosOpen] = useState(true);
  const [isOtrosOpen, setIsOtrosOpen] = useState(false);
  const [isGaseosasOpen, setIsGaseosasOpen] = useState(false);

  // Sincronizar ingredientes con complementos guardados
  useEffect(() => {
    if (isOpen) {
      const syncIngredients = (ingredients: Complement[]) =>
        ingredients.map((ing) => {
          console.log("SYNC INGREDIENT:", ing);
          if (ing.type === "special") {
            const hasVegetariano = complements.some((c) => c.id === ing.minusId);
            if (hasVegetariano) {
              return { ...ing, quantity: 0 };
            }

            const adicion = complements.find((c) => c.id === ing.additionId);
            if (adicion) {
              return { ...ing, quantity: 1 + adicion.quantity };
            }

            return { ...ing, quantity: 1 };
          }

          if (ing.type === "addable") {
            //esto esta harcodeado para el combo especial, pero no deberia estarlo , solo lo voy a comentar para acordarme. esto da mas problemas
            // const isComboEspecial = productId === 1;
            const adicion = complements.find((c) => c.id === ing.additionId);
            const aditionQty = adicion ? adicion.quantity : 0;

            // if (isComboEspecial) {
            // return { ...ing, quantity: 1 + aditionQty };
            // } else {
            return { ...ing, quantity: aditionQty };
            // }
          }

          if (ing.type === "removable") {
            const hasSinIngrediente = complements.some((c) => c.id === ing.id);
            if (hasSinIngrediente) {
              return { ...ing, quantity: 0 };
            }
            return { ...ing, quantity: 1 };
          }

          return ing;
        });

      setFavoritos(syncIngredients(favoritosData));
      setOtros(syncIngredients(otrosData));
      console.log("GASEOSAS SYNC:", syncIngredients(gaseosasData), gaseosasData);
      setGaseosas(syncIngredients(gaseosasData));
    }
  }, [complements, isOpen, productId]);

  // Manejo del botón "atrás" del navegador
  useEffect(() => {
    const handlePopState = () => onClose();

    if (isOpen) {
      window.history.pushState({ customModalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else {
      if (window.history.state?.customModalOpen) {
        window.history.back();
      }
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, onClose]);

  const handleIngredientChange = (
    ingredient: Complement,
    action: "plus" | "minus",
    section: "favoritos" | "otros" | "gaseosas"
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

    const updateSection = (prev: Complement[]) =>
      prev.map((i) =>
        i.id === ingredient.id ? { ...i, quantity: newQuantity } : i
      );

    if (section === "favoritos") {
      setFavoritos(updateSection);
    } else if (section === "otros") {
      setOtros(updateSection);
    } else if (section === "gaseosas") {
      setGaseosas(updateSection);
    }

    handleChangeComplement(ingredient, action);
  };

  const handleReset = () => {
    setFavoritos(favoritosData);
    setOtros(otrosData);
    setGaseosas(gaseosasData);
  };

  const renderIngredientSection = (
    ingredients: Complement[],
    section: "favoritos" | "otros" | "gaseosas"
  ) => {
    return ingredients.map((ingredient) => {
      const IconComponent = ingredient.icon ? iconMap[ingredient.icon] : null;
      return (
        <div
          key={ingredient.id}
          className="flex h-12 items-center gap-4 py-3 rounded-xl"
        >
          {IconComponent ? (
            <IconComponent />
          ) : (
            <div className="w-6 h-6 bg-accent-yellow-40 rounded-full" />
          )}

          <div className="flex-1 font-medium text-sm leading-4">
            <span className="text-[#313131]">{ingredient.name}</span>
            {ingredient.price && (
              <span className="text-[#808080]"> (+${ingredient.price})</span>
            )}
          </div>

          <QuantitySelector
            value={ingredient.quantity}
            onIncrease={() => handleIngredientChange(ingredient, "plus", section)}
            onDecrease={() => handleIngredientChange(ingredient, "minus", section)}
            size="sm"
          />
        </div>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        footer={
          <DialogFooter>
            <div className="flex justify-between items-center pt-4">
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
          </DialogFooter>
        }
        onOpenChange={onClose} className="p-0 bg-background modal-scrollbar rounded-2xl z-500 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-[16px] md:text-[20px] leading-[18px] md:leading-[22px] text-neutral-black-80">
            ¿QUIERES PERSONALIZAR TU {productName}?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-10 pb-10">
          <p className="body-font mt-5 text-neutral-black-60">
            Selecciona los ingredientes que quieres agregar o los que deseas retirar.
          </p>

          {/* SECCIÓN FAVORITOS */}
          <div className="flex flex-col items-start w-full">
            <button
              onClick={() => setIsFavoritosOpen(!isFavoritosOpen)}
              className="flex items-center gap-4 px-0 py-3 w-full border-b border-neutral-black-30"
            >
              <div className="flex-1 body-font font-bold text-left">
                Favoritos
              </div>
              {isFavoritosOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {isFavoritosOpen && (
              <div className="flex flex-col w-full pt-2">
                {renderIngredientSection(favoritos, "favoritos")}
              </div>
            )}
          </div>

          {/* SECCIÓN OTROS */}
          <div className="flex flex-col items-start w-full">
            <button
              onClick={() => setIsOtrosOpen(!isOtrosOpen)}
              className="flex items-center gap-4 px-0 py-3 w-full border-b border-neutral-black-30"
            >
              <div className="flex-1 body-font font-bold text-left">Otros</div>
              {isOtrosOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {isOtrosOpen && (
              <div className="flex flex-col w-full pt-2">
                {renderIngredientSection(otros, "otros")}
              </div>
            )}
          </div>

          {/* SECCIÓN GASEOSAS */}
          <div className="flex flex-col items-start w-full">
            <button
              onClick={() => setIsGaseosasOpen(!isGaseosasOpen)}
              className="flex items-center gap-4 px-0 py-3 w-full border-b border-neutral-black-30"
            >
              <div className="flex-1 body-font font-bold text-left">
                Bebidas
              </div>
              {isGaseosasOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {isGaseosasOpen && (
              <div className="flex flex-col w-full pt-2">
                {renderIngredientSection(gaseosas, "gaseosas")}
              </div>
            )}
          </div>

          {/* Botones de acción */}

        </div>
      </DialogContent>
    </Dialog>
  );
};