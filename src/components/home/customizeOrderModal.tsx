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
import { ChevronDown, ChevronUp, CupSoda } from "lucide-react";

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

// FAVORITOS - Ingredientes principales
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

// OTROS - Ingredientes secundarios y vegetales
const otrosData: Complement[] = [
  {
    id: 14,
    name: "Lechuga",
    price: null,
    icon: "LechugaIcon",
    quantity: 1,
    type: "special",
    additionId: 29,
    minusId: 11,
    minusComplement: false,
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

// GASEOSAS - Bebidas
const gaseosasData: Complement[] = [
  {
    id: 10,
    name: "Coca-Cola personal",
    price: 4000,
    icon: "CupSoda",
    quantity: 0,
    type: "addable",
    additionId: 10,
    minusComplement: false,
  },
  {
    id: 9,
    name: "Coca-Cola 1/ litro",
    price: 9000,
    icon: "CupSoda",
    quantity: 0,
    type: "addable",
    additionId: 9,
    minusComplement: false,
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
  productId,
  handleChangeComplement,
  complements = [],
}: CustomizationModalSectionProps) => {
  const [favoritos, setFavoritos] = useState<Complement[]>(favoritosData);
  const [otros, setOtros] = useState<Complement[]>(otrosData);
  const [gaseosas, setGaseosas] = useState<Complement[]>(gaseosasData);

  // Estados de los acordeones
  const [isFavoritosOpen, setIsFavoritosOpen] = useState(true);
  const [isOtrosOpen, setIsOtrosOpen] = useState(true);
  const [isGaseosasOpen, setIsGaseosasOpen] = useState(false);

  // Sincronizar ingredientes con complementos guardados
  useEffect(() => {
    if (isOpen) {
      const syncIngredients = (ingredients: Complement[]) =>
        ingredients.map((ing) => {
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
            const isComboEspecial = productId === 1;
            const adicion = complements.find((c) => c.id === ing.additionId);
            const aditionQty = adicion ? adicion.quantity : 0;

            if (isComboEspecial) {
              return { ...ing, quantity: 1 + aditionQty };
            } else {
              return { ...ing, quantity: aditionQty };
            }
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
      <DialogContent onOpenChange={onClose} className="p-0 bg-background modal-scrollbar rounded-2xl z-500 max-h-[90vh] overflow-y-auto">
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
                Gaseosas
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
        </div>
      </DialogContent>
    </Dialog>
  );
};