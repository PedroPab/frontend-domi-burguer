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
import { ChevronDown, ChevronUp, CupSoda } from "lucide-react";
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
  CupSoda,
};

// SECCIONES
const favoritosData: Complement[] = [
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

const otrosData: Complement[] = [
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
];

const gaseosasData: Complement[] = [
  {
    id: 501,
    name: "Coca Cola",
    price: 3000,
    icon: "CupSoda",
    quantity: 0,
    type: "addable",
    additionId: 501,
    minusComplement: false,
  },
  {
    id: 502,
    name: "Sprite",
    price: 3000,
    icon: "CupSoda",
    quantity: 0,
    type: "addable",
    additionId: 502,
    minusComplement: false,
  },
  {
    id: 503,
    name: "Fanta",
    price: 3000,
    icon: "CupSoda",
    quantity: 0,
    type: "addable",
    additionId: 503,
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
            const minus = cartItem.complements.some(
              (c) => c.id === ing.minusId
            );
            if (minus) return { ...ing, quantity: 0 };

            const add = cartItem.complements.find(
              (c) => c.id === ing.additionId
            );
            return { ...ing, quantity: add ? 1 + add.quantity : 1 };
          }

          if (ing.type === "addable") {
            const add = cartItem.complements.find(
              (c) => c.id === ing.additionId
            );
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

  // Cierra con botón atrás
  useEffect(() => {
    const handlePopState = () => onClose();

    if (isOpen) {
      window.history.pushState({ complementsModalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else if (window.history.state?.complementsModalOpen) {
      window.history.back();
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
    )
      return;
    if (action === "minus" && ingredient.quantity <= 0) return;

    const newQuantity =
      action === "plus" ? ingredient.quantity + 1 : ingredient.quantity - 1;

    const updateList = (list: Complement[]) =>
      list.map((i) =>
        i.id === ingredient.id ? { ...i, quantity: newQuantity } : i
      );

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
    isOpen: boolean,
    toggle: () => void
  ) => (
    <div className="flex flex-col items-start w-full">
      <button
        onClick={toggle}
        className="flex items-center gap-4 px-0 py-3 w-full border-b border-neutral-black-30"
      >
        <div className="flex-1 body-font font-bold text-left">{title}</div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col w-full pt-2">
          {ingredients.map((ingredient) => {
            const Icon = ingredient.icon ? iconMap[ingredient.icon] : null;
            return (
              <div
                key={ingredient.id}
                className="flex h-12 items-center gap-4 py-3 rounded-xl"
              >
                {Icon && <Icon />}
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
                    handleIngredientChange(ingredient, "plus", section)
                  }
                  onDecrease={() =>
                    handleIngredientChange(ingredient, "minus", section)
                  }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenChange={onClose} className="p-0 bg-background modal-scrollbar rounded-2xl z-500 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-[16px] md:text-[20px] leading-[18px] md:leading-[22px] text-neutral-black-80">
            ¿QUIERES PERSONALIZAR TU {cartItem?.name}?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-10 pb-10">
          <p className="body-font mt-5 text-start text-neutral-black-60">
            Selecciona los ingredientes que quieres agregar o los que deseas
            retirar.
          </p>

          {renderSection(
            "Favoritos",
            favoritos,
            "favoritos",
            isFavoritosOpen,
            () => setIsFavoritosOpen(!isFavoritosOpen)
          )}
          {renderSection("Otros", otros, "otros", isOtrosOpen, () =>
            setIsOtrosOpen(!isOtrosOpen)
          )}
          {renderSection("Gaseosas", gaseosas, "gaseosas", isGaseosasOpen, () =>
            setIsGaseosasOpen(!isGaseosasOpen)
          )}

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="ghost"
              className="bg-accent-yellow-40 hover:bg-accent-yellow-60 rounded-[30px] w-[133px] h-[48px]"
              onClick={onClose}
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
