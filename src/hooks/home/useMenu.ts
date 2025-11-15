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

  const isComboEspecial = productId === 1;

  if (isComboEspecial) {
    if (action === 'minus' && newQuantity < 1) {
      return { complementsToAdd, complementsToRemove };
    }

    if (action === 'plus' && newQuantity > 1 && ingredient.additionId) {
      const existing = currentComplements.find(c => c.id === ingredient.additionId);
      if (!existing) {
        const { additionId, minusId, ...rest } = ingredient;
        complementsToAdd.push({
          ...rest,
          id: ingredient.additionId,
          minusComplement: false,
          quantity: 1,
        });
      }
    }

    if (action === 'minus' && newQuantity === 1 && ingredient.additionId) {
      complementsToRemove.push(ingredient.additionId);
    }

    return { complementsToAdd, complementsToRemove };
  }

  if (action === 'minus' && newQuantity < 0) {
    return { complementsToAdd, complementsToRemove };
  }

  if (action === 'plus' && newQuantity === 1 && ingredient.additionId) {
    const { additionId, minusId, ...rest } = ingredient;
    complementsToAdd.push({
      ...rest,
      id: ingredient.additionId,
      minusComplement: false,
      quantity: 1,
    });
  }

  if (action === 'minus' && newQuantity === 0 && ingredient.additionId) {
    complementsToRemove.push(ingredient.additionId);
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
      const { additionId, minusId, ...rest } = ingredient;
      complementsToAdd.push({
        ...rest,
        id: ingredient.additionId,
        minusComplement: false,
        quantity: 1,
      });
    }
  }
  
  if (action === 'minus') {
    if (newQuantity === 0 && ingredient.minusId) {
      const hasVegetariano = currentComplements.some(c => c.id === ingredient.minusId);
      if (!hasVegetariano) {
        const { additionId, minusId, ...rest } = ingredient;
        complementsToAdd.push({
          ...rest,
          id: ingredient.minusId,
          minusComplement: true,
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

  if (action === 'plus' && newQuantity > 1) {
    return { complementsToAdd, complementsToRemove };
  }

  if (action === 'plus' && newQuantity === 1) {
    complementsToRemove.push(ingredient.id);
    return { complementsToAdd, complementsToRemove };
  }

  if (action === 'minus' && newQuantity === 0) {
    const hasRemoval = currentComplements.some((c) => c.id === ingredient.id);
    if (!hasRemoval) {
      complementsToAdd.push({
        ...ingredient,
        id: ingredient.id,
        minusComplement: true,
        quantity: 1,
        price: 0,
      });
    }
    return { complementsToAdd, complementsToRemove };
  }

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
      basePrice: 23900,
      price: 23900,
      body: "Pan artesanal hecho en casa, carne jugosa, tocineta crocante, queso mozzarella lechuga fresca, tomate , pepinos, cebolla y el toque de nuestra Salsa de Ajo.",
      bigImage: "/burgerBig.png",
      image1: "/burgerSmall.png",
      icons: [CarneIcon, TomateIcon, QuesoIcon, TocinetaIcon],
      quantity: 1,
      complements: [],
    },
    {
      id: 1,
      name: "COMBO ESPECIAL",
      basePrice: 28900,
      price: 28900,
      body: "Nuestra hamburguesa estrella, acompañada de papas rizadas, crocantes.",
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
      basePrice: 27000,
      price: 27000,
      body: "Cremosa, intensa y perfectamente balanceada, nuestra receta familiar de Salsa de Ajo. Es el secreto que se queda en tu memoria.",
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

        complementsToRemove.forEach((id) => {
          updatedComplements = updatedComplements.filter((c) => c.id !== id);
        });

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

  
  const handleRemoveComplement = (complementId: number) => {
    setProducts((prev) =>
      prev.map((product, index) => {
        if (index !== actualProduct) return product;

        // Encontrar el complemento a eliminar
        const complementToRemove = product.complements.find(c => c.id === complementId);
        
        if (!complementToRemove) return product;

        console.log("Eliminando complemento:", complementToRemove);

        // Filtrar el complemento del array
        const updatedComplements = product.complements.filter(c => c.id !== complementId);

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

  /**
   * Calcula el precio total del producto incluyendo complementos
   */
  const calculateProductPrice = (product: Product): number => {
    const basePrice = product.price;
    
    // Sumar el precio de todos los complementos
    const complementsPrice = product.complements.reduce((total, complement) => {
      // Solo sumar si el complemento tiene precio y no es un "minus" (sin ingrediente)
      if (complement.price && complement.price > 0 && !complement.minusComplement) {
        return total + (complement.price * complement.quantity);
      }
      return total;
    }, 0);

    return basePrice + complementsPrice;
  };

  /**
   * Resetea el producto actual a su estado inicial
   * Limpia todos los complementos y restaura la cantidad a 1
   */
  const resetCurrentProduct = () => {
    setProducts((prev) =>
      prev.map((product, index) =>
        index === actualProduct
          ? { ...product, complements: [], quantity: 1 }
          : product
      )
    );
  };

  const currentProduct = {
    ...products[actualProduct],
    // Sobrescribir el precio con el precio calculado dinámicamente
    price: calculateProductPrice(products[actualProduct])
  };

  return {
    products,
    actualProduct,
    currentProduct,
    handleIncrease,
    handleDecrease,
    handleChangeProduct,
    handleChangeComplement,
    handleRemoveComplement,
    resetCurrentProduct, 
    clearCurrentProductComplements,
    getCurrentProductComplements,
  };
}