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
  TomateIcon,
} from "../ui/icons";
import { QuantitySelector } from "../ui/quantitySelector";

const ingredientsData = [
  {
    id: "carne",
    name: "Carne",
    price: "+$6.000",
    icon: CarneIcon,
    quantity: 1,
  },
  {
    id: "lechuga",
    name: "Lechuga",
    price: null,
    icon: LechugaIcon,
    quantity: 1,
  },
  {
    id: "tomate",
    name: "Tomate",
    price: null,
    icon: TomateIcon,
    quantity: 1,
  },
  {
    id: "tocineta",
    name: "Tocineta",
    price: "+$3.500",
    icon: TomateIcon,
    quantity: 1,
  },
  {
    id: "pepinillos",
    name: "Pepinillos",
    price: null,
    icon: PicklesIcon,
    quantity: 1,
  },
  {
    id: "salsas",
    name: "Salsas",
    price: null,
    icon: SouceIcon,
    quantity: 1,
  },
  {
    id: "queso",
    name: "Queso americano",
    price: "+$2.000",
    icon: QuesoIcon,
    quantity: 1,
  },
  {
    id: "papas",
    name: "Papas rizadas",
    price: "+$6.800",
    icon: FrenchFriesIcon,
    quantity: 1,
  },
];

interface CustomizationModalSectionProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export const CustomizationModalSection = ({
  isOpen,
  onClose,
  productName = "BURGER",
}: CustomizationModalSectionProps) => {
  const [ingredients, setIngredients] = useState(ingredientsData);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    if (isOpen) {
      window.history.pushState({ modalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else {
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  //Funciones para aumentar
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  //Funciones para disminuir
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0 bg-background rounded-2xl  z-500">
        <DialogHeader className="p-10 pb-0">
          <DialogTitle className="font-bold text-[16px] md:text-[20px] text-center leading-[18px] md:leading-[22px] text-neutral-black-80">
            ¿QUIERES PERSONALIZAR TU {productName ? productName : "BURGER"}?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-10 pb-10">
          <p className="body-font">
            Si la ubicación en el mapa no es correcta, mueve el pin a la
            posición real de tu dirección.
          </p>

          <div className="flex flex-col">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex h-12 items-center gap-4 py-3 rounded-xl"
              >
                <ingredient.icon />

                <div className="flex-1 [font-family:'Montserrat',Helvetica] font-medium text-sm tracking-[0] leading-4">
                  <span className="text-[#313131]">{ingredient.name}</span>
                  {ingredient.price && (
                    <>
                      <span className="text-[#313131]"> </span>
                      <span className="text-[#808080]">
                        ({ingredient.price})
                      </span>
                    </>
                  )}
                </div>

                <QuantitySelector
                  value={quantity}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  size="sm"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[133px] h-[48px]"
              onClick={onClose}
            >
              <span>CANCELAR</span>
            </Button>

            <Button className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[133px] h-[48px]">
              <span>CONFIRMAR</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
