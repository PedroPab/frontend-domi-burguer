import { useCartStore } from "@/store/cartStore";
import { Product, Complement } from "@/types/products";

/**
 * Genera un ID único para un item del carrito basado en producto y complementos
 */
const generateCartItemId = (productId: number, complements: Complement[]): string => {
  if (complements.length === 0) {
    return `product-${productId}`;
  }
  
  // Crear un string único ordenando complementos por ID
  const complementsSignature = complements
    .sort((a, b) => a.id - b.id)
    .map(c => `${c.id}:${c.quantity}`)
    .join('|');
  
  return `product-${productId}-complements-${complementsSignature}`;
};

/**
 * Calcula el precio total incluyendo complementos
 * Maneja correctamente complementos de adición y descuento
 */
const calculateTotalPrice = (basePrice: number, complements: Complement[]): number => {
  let total = basePrice;
  
  console.log('=== Calculando precio ===');
  console.log('Precio base:', basePrice);
  
  complements.forEach(complement => {
    // Solo sumar precios de complementos que tienen costo
    if (complement.price && complement.price > 0) {
      const complementPrice = complement.price * complement.quantity;
      total += complementPrice;
      
      console.log(`${complement.name}: $${complement.price} x ${complement.quantity} = $${complementPrice}`);
    } else {
      console.log(`${complement.name}: Sin costo adicional`);
    }
  });
  
  console.log('Precio total calculado:', total);
  console.log('=====================');
  
  return total;
};

export const useAddToCart = () => {
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    // Generar ID único basado en producto y complementos
    const uniqueId = generateCartItemId(product.id, product.complements);
    
    // Calcular precio total con complementos
    const totalPrice = calculateTotalPrice(product.price, product.complements);
    
    
    // Crear item del carrito
    const cartItem = {
      id: uniqueId,
      productId: product.id,
      name: product.name,
      price: totalPrice,
      basePrice: product.price,
      quantity: product.quantity,
      image1: product.image1,
      image2: product.image2 || null,
      complements: product.complements,
    };
    
    addItem(cartItem);
    
    console.log('✅ Producto añadido al carrito:', {
      id: uniqueId,
      productName: product.name,
      quantity: product.quantity,
      complementsCount: product.complements.length,
      basePrice: product.price,
      totalPrice,
      pricePerUnit: totalPrice,
      totalCost: totalPrice * product.quantity,
    });
  };

  return { handleAddToCart };
};