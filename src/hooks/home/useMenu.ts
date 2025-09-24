"use client";

import { useState } from "react";
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

// Hook personalizado que maneja el menú de productos
export function useMenu() {
  // Lista de productos del menú con su información
  const products = [
    {
      id: 0,
      name: "HAMBURGUESA ARTESANAL",
      price: 18900,
      body: "Pan brioche dorado, carne jugosa, tocineta crocante, lechuga fresca, tomate y el toque de nuestra salsa secreta.",
      image: "/burgerBig.png", // Imagen principal del producto
      icons: [CarneIcon, TomateIcon, QuesoIcon, TocinetaIcon], // Íconos de ingredientes
    },
    {
      id: 1,
      name: "COMBO ESPECIAL",
      price: 22900,
      body: "Nuestra hamburguesa estrella, acompañada de papas rizadas doradas, crocantes y listas para el dip.",
      image: "/comboEspecial.png",
      icons: [HamburgerIcon, FrenchFriesIcon],
    },
    {
      id: 2,
      name: "SALSA DE AJO",
      price: 25000,
      body: "Cremosa, intensa y perfectamente balanceada, nuestra receta familiar de salsa de ajo. Es el secreto que se queda en tu memoria.",
      image: "/salsaAjo.png",
      icons: [HuevoIcon, AjoIcon],
    },
    {
      id: 3,
      name: "PAPITAS RISADAS",
      body: "Doradas, crujientes y hechas para el dip. La textura perfecta para acompañar tu hamburguesa.",
      price: 6999,
      image: "/papasRisadas.png",
      icons: [FrenchFriesIcon],
    },
  ];

  // Estado para saber cuál producto está activo (por defecto el primero)
  const [actualProduct, setActualProduct] = useState(0);

  const [quantity, setQuantity] = useState(1);

  //Funciones para aumentar
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  //Funciones para disminuir
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // evita bajar de 1
  };

  // Cambiar producto manualmente por índice
  const handleChangeProduct = (index: number) => {
    setActualProduct(index);
  };

  // Ir al siguiente producto (y volver al inicio si se llega al final)
  const handleNextProduct = () => {
    setActualProduct((prevIndex) => (prevIndex + 1) % products.length);
  };

  // Ir al producto anterior (y saltar al último si estamos en el primero)
  const handlePrevProduct = () => {
    setActualProduct(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length
    );
  };

  // Producto que está actualmente seleccionado
  const currentProduct = products[actualProduct];

  // Retornamos todo lo necesario para que otros componentes usen este hook
  return {
    products, // lista completa
    actualProduct, // índice actual
    currentProduct, // producto actual
    quantity,
    handleIncrease,
    handleDecrease,
    handleChangeProduct,
    handleNextProduct,
    handlePrevProduct,
  };
}
