import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Complement } from "@/types/products";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateCartItemId = (
  productId: number,
  complements: Complement[]
): string => {
  if (complements.length === 0) {
    return `product-${productId}`;
  }

  // Crear un string único ordenando complementos por ID
  const complementsSignature = complements
    .sort((a, b) => a.id - b.id)
    .map((c) => `${c.id}:${c.quantity}`)
    .join("|");

  return `product-${productId}-complements-${complementsSignature}`;
};

export const calculateTotalPrice = (
  basePrice: number,
  complements: Complement[]
): number => {
  let total = basePrice;

  console.log("=== Calculando precio ===");
  console.log("Precio base:", basePrice);

  complements.forEach((complement) => {
    // Solo sumar precios de complementos que tienen costo
    if (complement.price && complement.price > 0) {
      const complementPrice = complement.price * complement.quantity;
      total += complementPrice;

      console.log(
        `${complement.name}: $${complement.price} x ${complement.quantity} = $${complementPrice}`
      );
    } else {
      console.log(`${complement.name}: Sin costo adicional`);
    }
  });

  console.log("Precio total calculado:", total);
  console.log("=====================");

  return total;
};