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
  productId: number,
  newQuantity: number
): {
  complementsToAdd: Complement[];
  complementsToRemove: number[];
} => {
  const complementsToAdd: Complement[] = [];
  const complementsToRemove: number[] = [];

  // Verificar si es Combo Especial (id: 1) - las papas vienen incluidas
  const isComboEspecial = productId === 1;

  if (isComboEspecial) {
    // En Combo Especial: cantidad mínima es 1, no puede bajar a 0
    if (action === 'minus' && newQuantity < 1) {
      return { complementsToAdd, complementsToRemove };
    }

    // Manejar complementos de adición
    if (action === 'plus' && newQuantity > 1 && ingredient.additionId) {
      const existing = currentComplements.find(c => c.id === ingredient.additionId);
      if (!existing) {
        complementsToAdd.push({
          ...ingredient,
          id: ingredient.additionId,
          name: `Adición de ${ingredient.name}`,
          quantity: 1,
        });
      }
    }

    if (action === 'plus' && newQuantity > 2 && ingredient.additionId) {
      // Incrementar adición existente
    }

    if (action === 'minus' && newQuantity === 1 && ingredient.additionId) {
      complementsToRemove.push(ingredient.additionId);
    }

    if (action === 'minus' && newQuantity > 1 && ingredient.additionId) {
      // Decrementar adición existente
    }

    return { complementsToAdd, complementsToRemove };
  }

  // En otros productos (Hamburguesa Artesanal): inicia en 0, se puede agregar
  if (action === 'minus' && newQuantity < 0) {
    return { complementsToAdd, complementsToRemove };
  }

  // Al pasar de 0 a 1, agregar complemento de adición
  if (action === 'plus' && newQuantity === 1 && ingredient.additionId) {
    complementsToAdd.push({
      ...ingredient,
      id: ingredient.additionId,
      name: `Adición de ${ingredient.name}`,
      quantity: 1,
    });
  }

  // Al pasar de 1 a 0, quitar complemento de adición
  if (action === 'minus' && newQuantity === 0 && ingredient.additionId) {
    complementsToRemove.push(ingredient.additionId);
  }

  // Manejar incrementos/decrementos cuando qty >= 2
  if (action === 'plus' && newQuantity > 1 && ingredient.additionId) {
    // Se manejará en el reducer principal
  }

  if (action === 'minus' && newQuantity > 0 && ingredient.additionId) {
    // Se manejará en el reducer principal
  }

  return { complementsToAdd, complementsToRemove };
};

/**
 * Maneja la lógica de complementos SPECIAL (ej: Carne)
 */
const handleSpecialComplement = (
  ingredient: Complement,
  action: 'plus' | 'minus',
  currentComplements: Complement[],
  newQuantity: number
): {
  complementsToAdd: Complement[];
  complementsToRemove: number[];
} => {
  const complementsToAdd: Complement[] = [];
  const complementsToRemove: number[] = [];

  if (action === 'plus') {
    if (newQuantity === 1 && ingredient.minusId) {
      complementsToRemove.push(ingredient.minusId);
    }
    
    if (newQuantity === 2 && ingredient.additionId) {
      complementsToAdd.push({
        ...ingredient,
        id: ingredient.additionId,
        name: `Adición de ${ingredient.name}`,
        quantity: 1,
      });
    }
  }
  
  if (action === 'minus') {
    if (newQuantity === 0 && ingredient.minusId) {
      const hasVegetariano = currentComplements.some(c => c.id === ingredient.minusId);
      if (!hasVegetariano) {
        complementsToAdd.push({
            ...ingredient,
          id: ingredient.minusId,
          name: 'Vegetariano',
          quantity: 1,
          price: 0,
        });
      }
    }
    
    if (newQuantity === 1 && ingredient.additionId) {
      complementsToRemove.push(ingredient.additionId);
    }
  }

  return { complementsToAdd, complementsToRemove };
};

/**
 * Maneja la lógica de complementos REMOVABLE (ej: Lechuga)
 */
const handleRemovableComplement = (
  ingredient: Complement,
  action: 'plus' | 'minus',
  currentComplements: Complement[],
  newQuantity: number
): {
  complementsToAdd: Complement[];
  complementsToRemove: number[];
} => {
  const complementsToAdd: Complement[] = [];
  const complementsToRemove: number[] = [];

  // Si intenta aumentar más de 1, no hacer nada
  if (action === 'plus' && newQuantity > 1) {
    return { complementsToAdd, complementsToRemove };
  }

  // Si aumenta de 0 a 1, quitar "sin [ingrediente]"
  if (action === 'plus' && newQuantity === 1) {
    complementsToRemove.push(ingredient.id);
    return { complementsToAdd, complementsToRemove };
  }

  // Si disminuye de 1 a 0, agregar "sin [ingrediente]"
  if (action === 'minus' && newQuantity === 0) {
    const hasRemoval = currentComplements.some((c) => c.id === ingredient.id);
    if (!hasRemoval) {
      complementsToAdd.push({
        ...ingredient,
        id: ingredient.id,
        name: `Sin ${ingredient.name}`,
        quantity: 1,
        price: 0,
      });
    }
    return { complementsToAdd, complementsToRemove };
  }

  // Si intenta disminuir más de 0, no hacer nada
  if (action === 'minus' && newQuantity < 0) {
    return { complementsToAdd, complementsToRemove };
  }

  return { complementsToAdd, complementsToRemove };
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
      bigImage: "/burgerBig.png",
      image1: "/burgerSmall.png",
      icons: [CarneIcon, TomateIcon, QuesoIcon, TocinetaIcon],
      quantity: 1,
      complements: [],
    },
    {
      id: 1,
      name: "COMBO ESPECIAL",
      price: 22900,
      body: "Nuestra hamburguesa estrella, acompañada de papas rizadas doradas, crocantes y listas para el dip.",
      bigImage: "/comboEspecial.png",
      image1: "/burgerSmall.png",
      image2: "/papitasSmall.png",
      icons: [HamburgerIcon, FrenchFriesIcon],
      quantity: 1,
      complements: [],
    },
    {
      id: 38,
      name: "SALSA DE AJO",
      price: 25000,
      body: "Cremosa, intensa y perfectamente balanceada, nuestra receta familiar de salsa de ajo. Es el secreto que se queda en tu memoria.",
      bigImage: "/salsaAjo.png",
      image1: "/salsaSmall.png",
      icons: [HuevoIcon, AjoIcon],
      quantity: 1,
      complements: [],
    },
  ]);

  const [actualProduct, setActualProduct] = useState(0);

  useEffect(() => {
    console.log("Current product complements:", products[actualProduct].complements);
  }, [products, actualProduct]);

    const handleIncrease = () => {
    setProducts((prev) =>
      prev.map((product, index) =>
        index === actualProduct
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const handleDecrease = () => {
    setProducts((prev) =>
      prev.map((product, index) =>
        index === actualProduct
          ? { ...product, quantity: Math.max(1, product.quantity - 1) }
          : product
      )
    );
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
    const newQuantity = action === 'plus' ? ingredient.quantity + 1 : ingredient.quantity - 1;

    setProducts((prev) =>
      prev.map((product, index) => {
        if (index !== actualProduct) return product;

        let result;
        
        if (ingredient.type === 'special') {
          result = handleSpecialComplement(ingredient, action, product.complements, newQuantity);
        } else if (ingredient.type === 'addable') {
          result = handleAddableComplement(ingredient, action, product.complements, product.id, newQuantity);
        } else {
          result = handleRemovableComplement(ingredient, action, product.complements, newQuantity);
        }

        const { complementsToAdd, complementsToRemove } = result;

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
          if ((action === 'plus' && ingredient.quantity > 1) || (action === 'plus' && ingredient.quantity >= 1 && ingredient.id === 7 && product.id === 2)) {
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
    handleIncrease,
    handleDecrease,
    handleChangeProduct,
    handleChangeComplement,
    clearCurrentProductComplements,
    getCurrentProductComplements,
  };
}