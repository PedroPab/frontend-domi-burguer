"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { QuantitySelector } from "../ui/quantitySelector";
import { Complement } from "@/types/products";
import { useCartStore, CartItem } from "@/store/cartStore";
import { favoritosData, otrosData, gaseosasData, iconMap } from "@/utils/complementSections";
import { Modal } from "@/components/ui/modal";

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
  const { updateItemComplements } = useCartStore();

  const [favoritos, setFavoritos] = useState(favoritosData);
  const [otros, setOtros] = useState(otrosData);
  const [gaseosas, setGaseosas] = useState(gaseosasData);

  const [isFavoritosOpen, setIsFavoritosOpen] = useState(true);
  const [isOtrosOpen, setIsOtrosOpen] = useState(true);
  const [isGaseosasOpen, setIsGaseosasOpen] = useState(false);

  // Sincroniza complementos con el carrito
  useEffect(() => {
    if (isOpen && cartItem) {
      const sync = (list: Complement[]) =>
        list.map((ing) => {
          if (ing.type === "special") {
            const minus = cartItem.complements.some((c) => c.id === ing.minusId);
            if (minus) return { ...ing, quantity: 0 };

            const add = cartItem.complements.find((c) => c.id === ing.additionId);
            return { ...ing, quantity: add ? 1 + add.quantity : 1 };
          }

          if (ing.type === "addable") {
            const add = cartItem.complements.find((c) => c.id === ing.additionId);
            return { ...ing, quantity: add ? add.quantity : 0 };
          }

          if (ing.type === "removable") {
            const removed = cartItem.complements.some((c) => c.id === ing.id);
            return { ...ing, quantity: removed ? 0 : 1 };
          }

          return ing;
        });

      setFavoritos(sync(favoritosData));
      setOtros(sync(otrosData));
      setGaseosas(sync(gaseosasData));
    }
  }, [cartItem, isOpen]);

  const handleIngredientChange = (
    ingredient: Complement,
    action: "plus" | "minus",
    section: "favoritos" | "otros" | "gaseosas"
  ) => {
    if (action === "plus" && ingredient.type === "removable" && ingredient.quantity >= 1)
      return;
    if (action === "minus" && ingredient.quantity <= 0) return;

    const newQuantity =
      action === "plus" ? ingredient.quantity + 1 : ingredient.quantity - 1;

    const updateList = (list: Complement[]) =>
      list.map((i) => (i.id === ingredient.id ? { ...i, quantity: newQuantity } : i));

    if (section === "favoritos") setFavoritos(updateList);
    if (section === "otros") setOtros(updateList);
    if (section === "gaseosas") setGaseosas(updateList);
  };

  const convertToComplements = (): Complement[] => {
    const all = [...favoritos, ...otros, ...gaseosas];
    const complements: Complement[] = [];

    all.forEach((ing) => {
      if (ing.type === "special") {
        if (ing.quantity === 0 && ing.minusId)
          complements.push({
            ...ing,
            id: ing.minusId,
            minusComplement: true,
            quantity: 1,
            price: 0,
          });
        else if (ing.quantity > 1 && ing.additionId)
          complements.push({
            ...ing,
            id: ing.additionId,
            quantity: ing.quantity - 1,
          });
      } else if (ing.type === "addable") {
        if (ing.quantity > 0 && ing.additionId)
          complements.push({
            ...ing,
            id: ing.additionId,
            quantity: ing.quantity,
          });
      } else if (ing.type === "removable" && ing.quantity === 0) {
        complements.push({
          ...ing,
          id: ing.id,
          minusComplement: true,
          quantity: 1,
          price: 0,
        });
      }
    });

    return complements;
  };

  const handleConfirm = () => {
    const newComplements = convertToComplements();
    updateItemComplements(cartItem.id, newComplements);
    onClose();
  };

  const renderSection = (
    title: string,
    ingredients: Complement[],
    section: "favoritos" | "otros" | "gaseosas",
    sectionOpen: boolean,
    toggle: () => void
  ) => (
    <div className="flex flex-col items-start w-full">
      <button
        onClick={toggle}
        className="flex items-center gap-4 px-0 py-3 w-full border-b border-neutral-black-30"
      >
        <div className="flex-1 body-font font-bold text-left">{title}</div>
        {sectionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {sectionOpen && (
        <div className="flex flex-col w-full pt-2">
          {ingredients.map((ingredient) => {
            const Icon = ingredient.icon ? iconMap[ingredient.icon] : null;
            return (
              <div key={ingredient.id} className="flex h-12 items-center gap-4 py-3 rounded-xl">
                {Icon && <Icon />}
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
          })}
        </div>
      )}
    </div>
  );

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={`¿QUIERES PERSONALIZAR TU ${cartItem?.name}?`}
      description="Selecciona los ingredientes que quieres agregar o los que deseas retirar."
      size="lg"
      footer={{
        cancel: { label: "CANCELAR" },
        confirm: { label: "CONFIRMAR", onClick: handleConfirm },
      }}
    >
      <div className="flex flex-col gap-4">
        {renderSection("Favoritos", favoritos, "favoritos", isFavoritosOpen, () =>
          setIsFavoritosOpen(!isFavoritosOpen)
        )}
        {renderSection("Otros", otros, "otros", isOtrosOpen, () =>
          setIsOtrosOpen(!isOtrosOpen)
        )}
        {renderSection("Gaseosas", gaseosas, "gaseosas", isGaseosasOpen, () =>
          setIsGaseosasOpen(!isGaseosasOpen)
        )}
      </div>
    </Modal>
  );
};
