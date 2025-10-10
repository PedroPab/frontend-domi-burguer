"use client";

import { useEffect, useState } from "react";
import {
  CarneIcon,
  TomateIcon,
  QuesoIcon,
  TocinetaIcon,
  HamburgerIcon,
  FrenchFriesIcon,
  HuevoIcon,
  AjoIcon,
} from "@/components/ui/icons";
import { Product, Complement } from "@/types/products";

// ============================================
// HELPER FUNCTIONS - LÓGICA DE COMPLEMENTOS
// ============================================

/**
 * Maneja la lógica de complementos ADDABLE (ej: Papas)
 * Solo se pueden agregar, no vienen por defecto
 */
const handleAddableComplement = (
  ingredient: Complement,
  action: 'plus' | 'minus',
  currentComplements: Complement[],
  productId: number
): {
  newQuantity: number;
  complementsToAdd: Complement[];
  complementsToRemove: number[];
} => {
  const currentQty = ingredient.quantity;
  const complementsToAdd: Complement[] = [];
  const complementsToRemove: number[] = [];

  // Verificar si es Combo Especial (id: 1) - las papas vienen incluidas
  const isComboEspecial = productId === 1;

  if (isComboEspecial) {
    // En Combo Especial: cantidad mínima es 1, no puede bajar a 0
    if (action === 'minus' && currentQty <= 1) {
      return { newQuantity: 1, complementsToAdd, complementsToRemove };
    }

    // Aumentar o disminuir normalmente (nunca llega a 0)
    const newQty = action === 'plus' ? currentQty + 1 : currentQty - 1;

    // Manejar complementos de adición
    if (action === 'plus' && currentQty >= 1 && ingredient.additionId) {
      const existing = currentComplements.find(c => c.id === ingredient.additionId);
      if (!existing) {
        complementsToAdd.push({
          id: ingredient.additionId,
          name: `Adición de ${ingredient.name}`,
          quantity: 1,
        });
      }
    }

    if (action === 'plus' && currentQty >= 2 && ingredient.additionId) {
      // Incrementar adición existente
    }

    if (action === 'minus' && currentQty === 2 && ingredient.additionId) {
      complementsToRemove.push(ingredient.additionId);
    }

    if (action === 'minus' && currentQty > 2 && ingredient.additionId) {
      // Decrementar adición existente
    }

    return { newQuantity: newQty, complementsToAdd, complementsToRemove };
  }

  // En otros productos (Hamburguesa Artesanal): inicia en 0, se puede agregar
  if (action === 'minus' && currentQty <= 0) {
    return { newQuantity: 0, complementsToAdd, complementsToRemove };
  }

  const newQty = action === 'plus' ? currentQty + 1 : Math.max(0, currentQty - 1);

  // Al pasar de 0 a 1, agregar complemento de adición
  if (action === 'plus' && currentQty === 0 && ingredient.additionId) {
    complementsToAdd.push({
      id: ingredient.additionId,
      name: `Adición de ${ingredient.name}`,
      quantity: 1,
    });
  }

  // Al pasar de 1 a 0, quitar complemento de adición
  if (action === 'minus' && currentQty === 1 && ingredient.additionId) {
    complementsToRemove.push(ingredient.additionId);
  }

  // Manejar incrementos/decrementos cuando qty >= 2
  if (action === 'plus' && currentQty >= 1 && ingredient.additionId) {
    // Se manejará en el reducer principal
  }

  if (action === 'minus' && currentQty > 1 && ingredient.additionId) {
    // Se manejará en el reducer principal
  }

  return { newQuantity: newQty, complementsToAdd, complementsToRemove };
};

/**
 * Maneja la lógica de complementos SPECIAL (ej: Carne)
 */
const handleSpecialComplement = (
  ingredient: Complement,
  action: 'plus' | 'minus',
  currentComplements: Complement[]
): {
  newQuantity: number;
  complementsToAdd: Complement[];
  complementsToRemove: number[];
} => {
  const currentQty = ingredient.quantity;
  const newQty = action === 'plus' ? currentQty + 1 : Math.max(0, currentQty - 1);

  const complementsToAdd: Complement[] = [];
  const complementsToRemove: number[] = [];

  if (action === 'plus') {
    if (currentQty === 0 && ingredient.minusId) {
      complementsToRemove.push(ingredient.minusId);
    }
    
    if (currentQty === 1 && ingredient.additionId) {
      complementsToAdd.push({
        id: ingredient.additionId,
        name: `Adición de ${ingredient.name}`,
        quantity: 1,
      });
    }
  }
  
  if (action === 'minus') {
    if (currentQty === 1 && ingredient.minusId) {
      const hasVegetariano = currentComplements.some(c => c.id === ingredient.minusId);
      if (!hasVegetariano) {
        complementsToAdd.push({
          id: ingredient.minusId,
          name: 'Vegetariano',
          quantity: 1,
        });
      }
    }
    
    if (currentQty === 2 && ingredient.additionId) {
      complementsToRemove.push(ingredient.additionId);
    }
  }

  return { newQuantity: newQty, complementsToAdd, complementsToRemove };
};

/**
 * Maneja la lógica de complementos REMOVABLE (ej: Lechuga)
 * Usa el mismo ID del ingrediente para el complemento "Sin X"
 */
const handleRemovableComplement = (
  ingredient: Complement,
  action: 'plus' | 'minus',
  currentComplements: Complement[]
): {
  newQuantity: number;
  complementsToAdd: Complement[];
  complementsToRemove: number[];
} => {
  const currentQty = ingredient.quantity;
  const complementsToAdd: Complement[] = [];
  const complementsToRemove: number[] = [];

  // Si intenta aumentar más de 1, no hacer nada
  if (action === 'plus' && currentQty >= 1) {
    return { newQuantity: currentQty, complementsToAdd, complementsToRemove };
  }

  // Si aumenta de 0 a 1, quitar "sin [ingrediente]"
  if (action === 'plus' && currentQty === 0) {
    complementsToRemove.push(ingredient.id);
    return { newQuantity: 1, complementsToAdd, complementsToRemove };
  }

  // Si disminuye de 1 a 0, agregar "sin [ingrediente]"
  if (action === 'minus' && currentQty === 1) {
    const hasRemoval = currentComplements.some((c) => c.id === ingredient.id);
    if (!hasRemoval) {
      complementsToAdd.push({
        id: ingredient.id,
        name: `Sin ${ingredient.name}`,
        quantity: 1,
      });
    }
    return { newQuantity: 0, complementsToAdd, complementsToRemove };
  }

  // Si intenta disminuir más de 0, no hacer nada
  if (action === 'minus' && currentQty <= 0) {
    return { newQuantity: 0, complementsToAdd, complementsToRemove };
  }

  return { newQuantity: currentQty, complementsToAdd, complementsToRemove };
};

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useMenu() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 2,
      name: "HAMBURGUESA ARTESANAL",
      price: 18900,
      body: "Pan brioche dorado, carne jugosa, tocineta crocante, lechuga fresca, tomate y el toque de nuestra salsa secreta.",
      image: "/burgerBig.png",
      icons: [CarneIcon, TomateIcon, QuesoIcon, TocinetaIcon],
      complements: [],
    },
    {
      id: 1,
      name: "COMBO ESPECIAL",
      price: 22900,
      body: "Nuestra hamburguesa estrella, acompañada de papas rizadas doradas, crocantes y listas para el dip.",
      image: "/comboEspecial.png",
      icons: [HamburgerIcon, FrenchFriesIcon],
      complements: [],
    },
    {
      id: 38,
      name: "SALSA DE AJO",
      price: 25000,
      body: "Cremosa, intensa y perfectamente balanceada, nuestra receta familiar de salsa de ajo. Es el secreto que se queda en tu memoria.",
      image: "/salsaAjo.png",
      icons: [HuevoIcon, AjoIcon],
      complements: [],
    },
  ]);

  const [actualProduct, setActualProduct] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    console.log("Current product complements:", products[actualProduct].complements);
  }, [products, actualProduct]);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleChangeProduct = (index: number) => {
    setActualProduct(index);
  };

  /**
   * Maneja cambios en los complementos de un ingrediente
   */
  const handleChangeComplement = (
    ingredient: Complement,
    action: 'plus' | 'minus'
  ) => {
    setProducts((prev) =>
      prev.map((product, index) => {
        if (index !== actualProduct) return product;

        let result;
        
        if (ingredient.type === 'special') {
          result = handleSpecialComplement(ingredient, action, product.complements);
        } else if (ingredient.type === 'addable') {
          result = handleAddableComplement(ingredient, action, product.complements, product.id);
        } else {
          result = handleRemovableComplement(ingredient, action, product.complements);
        }

        const { newQuantity, complementsToAdd, complementsToRemove } = result;

        let updatedComplements = [...product.complements];

        // Agregar nuevos complementos
        complementsToAdd.forEach((comp) => {
          const existing = updatedComplements.find((c) => c.id === comp.id);
          if (existing) {
            updatedComplements = updatedComplements.map((c) =>
              c.id === comp.id ? { ...c, quantity: c.quantity + 1 } : c
            );
          } else {
            updatedComplements.push(comp);
          }
        });

        // Remover complementos
        complementsToRemove.forEach((id) => {
          updatedComplements = updatedComplements.filter((c) => c.id !== id);
        });

        // Manejar incremento/decremento de adiciones
        if ((ingredient.type === 'special' || ingredient.type === 'addable') && ingredient.additionId) {
          if (action === 'plus' && ingredient.quantity >= 1) {
            const hasAddition = updatedComplements.find(c => c.id === ingredient.additionId);
            if (hasAddition) {
              updatedComplements = updatedComplements.map((c) =>
                c.id === ingredient.additionId
                  ? { ...c, quantity: c.quantity + 1 }
                  : c
              );
            }
          } else if (action === 'minus' && ingredient.quantity > 1) {
            updatedComplements = updatedComplements.map((c) =>
              c.id === ingredient.additionId
                ? { ...c, quantity: Math.max(1, c.quantity - 1) }
                : c
            );
          }
        }

        return { 
          ...product, 
          complements: updatedComplements,
        };
      })
    );
  };

  const clearCurrentProductComplements = () => {
    setProducts((prev) =>
      prev.map((product, index) =>
        index === actualProduct
          ? { ...product, complements: [] }
          : product
      )
    );
  };

  const getCurrentProductComplements = (): Complement[] => {
    return products[actualProduct]?.complements || [];
  };

  const currentProduct = products[actualProduct];

  return {
    products,
    actualProduct,
    currentProduct,
    quantity,
    handleIncrease,
    handleDecrease,
    handleChangeProduct,
    handleChangeComplement,
    clearCurrentProductComplements,
    getCurrentProductComplements,
  };
}