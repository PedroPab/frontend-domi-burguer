"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowIcon, EditarIcon, HamburgerIcon } from "@/components/ui/icons";
import { Plus } from "lucide-react";
import { useMenu } from "@/hooks/home/useMenu";
import { CustomizationModalSection } from "./customizeOrderModal";
import { useState, useCallback, useEffect } from "react";
import { QuantitySelector } from "@/components/ui/quantitySelector";
import { showFoodToast } from "../toastFood";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { Complements } from "../ui/complements";
import { ComplementsLarge } from "../ui/complementsLarge";

export default function MenuSection() {
  const {
    products,
    actualProduct,
    currentProduct,
    handleIncrease,
    handleDecrease,
    handleChangeProduct,
    handleChangeComplement,
    handleRemoveComplement,
    resetCurrentProduct,
  } = useMenu();
  console.log("RERENDER MENU SECTION", products, currentProduct);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const { handleAddToCart } = useAddToCart();

  // Configurar Embla Carousel para el carrusel principal
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    duration: 20,
    align: "center",
  });
  // Sincronizar el carrusel principal con el producto actual
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(actualProduct, false);
    }
  }, [actualProduct, emblaApi]);

  // Actualizar el producto cuando cambia el slide
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    if (index !== actualProduct) {
      handleChangeProduct(index);
    }
  }, [emblaApi, actualProduct, handleChangeProduct]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Manejar navegación con botones
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const handleEditProduct = (productName?: string) => {
    if (productName) {
      setSelectedProduct(productName);
    } else {
      setSelectedProduct("");
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-0 max-w-[1440px] w-screen">
        {/* Columna 1 - Carrusel Principal */}
        <div className="flex flex-col items-start justify-center gap-2 bg-[linear-gradient(45deg,rgba(255,194,5,1)_0%,rgba(255,194,5,0.4)_100%)] max-w-[720px] w-full mx-auto relative overflow-hidden">
          <div className="w-full h-[30px] xl:h-[14px]" />

          <div className="w-full aspect-[1/1] relative" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-[0_0_100%] min-w-0 relative"
                >
                  <div className="w-full aspect-[1/1] relative">
                    <Image
                      src={product.bigImage}
                      alt={product.name}
                      fill
                      className="object-contain"
                      priority={index === 0}
                      sizes="(max-width: 768px) 400px, 720px"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Botones de navegación */}
            <div className="w-full max-w-[720px] px-[13%] py-0 absolute top-[43%] left-0 flex justify-between z-10 pointer-events-none">
              <Button
                variant="ghost"
                className="w-10 h-10 md:w-14 md:h-14 bg-accent-yellow-20 rounded-[30px] hover:bg-accent-yellow-40 pr-5 transition-all active:scale-95 pointer-events-auto"
                onClick={scrollPrev}
              >
                <ArrowIcon className="w-5 h-5 rotate-180 text-neutral-black-80" />
              </Button>
              <Button
                variant="ghost"
                className="w-10 h-10 md:w-14 md:h-14 bg-accent-yellow-20 rounded-[30px] hover:bg-accent-yellow-40 pl-5 transition-all active:scale-95 pointer-events-auto"
                onClick={scrollNext}
              >
                <ArrowIcon className="w-5 h-5 text-neutral-black-80" />
              </Button>
            </div>
          </div>
        </div>

        {/* Columna 2 - Información del Producto 56 32*/}
        <div className="flex flex-col items-center justify-center p-10 md:p-20 md:pt-30 bg-accent-yellow-10 max-w-[720px] w-full mx-auto">
          <div className="flex flex-col w-full max-w-[400px] items-center gap-6 mb-8 md:mb-5">
            <div className="transition-opacity duration-300">
              <h1 className="text-center">
                {currentProduct.name.startsWith("HAMBURGUESA") ? (
                  <>
                    HAMBURGUESA <br />
                    {currentProduct.name.replace("HAMBURGUESA ", "")}
                  </>
                ) : (
                  currentProduct.name
                )}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-5 text-[#808080]">
              {currentProduct.icons.map((Icon, index) => (
                <Icon key={index} />
              ))}
            </div>
            <p className="text-center body-font max-w-[350px] transition-opacity duration-300">
              {currentProduct.body}
            </p>
            <Button
              variant="ghost"
              className={`px-4 py-2 w-[177px] h-[40px] bg-accent-yellow-20 hover:bg-accent-yellow-40 rounded-[30px] transition-all ${
                actualProduct === 2 ? "hidden" : ""
              }`}
              onClick={() => handleEditProduct()}
            >
              PERSONALIZAR <EditarIcon className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full mb-8 md:mb-12">
            <ComplementsLarge
              complements={currentProduct.complements}
              onRemove={handleRemoveComplement}
            />
          </div>

          <div className="flex w-full max-w-[720px] items-center justify-center gap-6 mb-8 md:mb-12">
            <QuantitySelector
              value={currentProduct.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              size="lg"
            />
            <div>
              <h1 className="font-bold! text-[28px]! md:text-[32px]! leading-[30px]! md:leading-[28px]!">
                ${(currentProduct.price * currentProduct.quantity).toLocaleString("es-CO")}
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full max-w-[720px] items-center justify-center gap-3 sm:gap-6">
            <Link href={"/cart"}>
              <Button
                onClick={() => {
                  handleAddToCart(currentProduct);
                  showFoodToast(currentProduct.name);
                  resetCurrentProduct();
                }}
                className="text-white leading-[18px]! font-semibold rounded-[30px] flex items-center gap-2 text-[16px] w-[199px] h-[48px] transition-all hover:scale-105 active:scale-95"
              >
                <HamburgerIcon className="w-6 h-6" />
                PAGAR AHORA
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[215px] h-[48px] transition-all hover:scale-105 active:scale-95"
              onClick={() => {
                handleAddToCart(currentProduct);
                showFoodToast(currentProduct.name);
                resetCurrentProduct();
              }}
            >
              AÑADIR AL CARRITO
            </Button>
          </div>
        </div>
      </section>

      {/* Sección de miniaturas de productos */}
      <section className="grid lg:gap-y-14 grid-cols-2 lg:grid-cols-3 items-center justify-center lg:gap-6 gap-2 gap-x-4 py-14 relative">
        {/* Cada tarjeta representa un producto (ejemplo producto 0) */}
        <div
          className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 ${
            actualProduct === 0 ? "bg-accent-yellow-40" : "bg-accent-yellow-20"
          } rounded-2xl border-0 overflow-visible`}
        >
          <div
            className={` flex relative flex-col items-center justify-center gap-[4.47px] overflow-visible p-0 h-full`}
            onClick={() => {
              handleChangeProduct(0);
              if (emblaApi) emblaApi.scrollTo(0);
            }}
          >
            {/* Imagen flotante del producto */}
            <Image
              src="/Burger1.png"
              alt="Burger"
              width={140}
              height={220}
              className="absolute top-[8px] left-[36px] lg:top-[-30px] lg:left-[70px] h-[149px] w-[94px] lg:w-[140.16px] lg:h-[220px] object-cover"
            />

            <Button
              size="icon"
              className={`absolute top-[5px] z-200 right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 rounded-[30px] p-0 ${
                actualProduct === 0 ? "hidden" : ""
              }`}
              onClick={() => {
                handleAddToCart(products[0]);
                showFoodToast(products[0].name);
                resetCurrentProduct();
              }}
            >
              <Plus className="text-white" />
            </Button>
          </div>
        </div>
        <div
          className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 ${
            actualProduct === 1 ? "bg-accent-yellow-40" : "bg-accent-yellow-20"
          } rounded-2xl border-0 overflow-visible`}
        >
          <div
            className={`${"relative gap-[4.47px]"} p-0 h-full`}
            onClick={() => {
              handleChangeProduct(1);
              if (emblaApi) emblaApi.scrollTo(1);
            }}
          >
            <Image
              src="/Burger1.png"
              alt="Burger"
              width={140}
              height={220}
              className="absolute top-[8px] left-[25px] lg:top-[-30px] lg:left-[45px] h-[149px] w-[94px] lg:w-[140.16px] lg:h-[220px] object-cover"
            />

            <Image
              src="/DomiburgerPapitas.png"
              alt="Burger"
              width={119}
              height={178}
              className="absolute top-[35px] left-[68px] lg:top-[23px] lg:left-[121px] w-[84px] h-[126px] lg:w-[119px] lg:h-[178px] object-cover"
            />

            <Button
              size="icon"
              className={`absolute z-200 top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 rounded-[30px] p-0 ${
                actualProduct === 1 ? "hidden" : ""
              }`}
              onClick={() => {
                handleAddToCart(products[1]);
                showFoodToast(products[1].name);
                resetCurrentProduct();
              }}
            >
              <Plus className="text-white" />
            </Button>
          </div>
        </div>
        <div
          className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 ${
            actualProduct === 2 ? "bg-accent-yellow-40" : "bg-accent-yellow-20"
          } rounded-2xl border-0 overflow-visible`}
          onClick={() => {
            handleChangeProduct(2);
            if (emblaApi) emblaApi.scrollTo(2);
          }}
        >
          <div className={`${"relative gap-[4.47px]"} p-0 h-full`}>
            <Image
              className="absolute top-[28px] lg:top-[-30px] w-[178px] h-[128px] lg:w-[308px] lg:h-[221px]"
              alt="Burger"
              src="/DomiburgerSalsa.png"
              width={308}
              height={221}
              priority
            />

            <Button
              size="icon"
              className={`absolute z-200 top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 rounded-[30px] p-0 ${
                actualProduct === 2 ? "hidden" : ""
              }`}
              onClick={() => {
                handleAddToCart(products[2]);
                showFoodToast(products[2].name);
                resetCurrentProduct();
              }}
            >
              <Plus className="text-white" />
            </Button>
          </div>
        </div>
        {/* <div
          className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 ${
            actualProduct === 3 ? "bg-accent-yellow-40" : "bg-accent-yellow-20"
          } rounded-2xl border-0 overflow-visible`}
          onClick={() => {
            handleChangeProduct(3);
            if (emblaApi) emblaApi.scrollTo(3);
          }}
        >
          <div className={`${"relative gap-[4.47px]"} p-0 h-full`}>
            <Image
              src="/DomiburgerPapitas2.png"
              alt="Burger"
              width={153}
              height={230}
              className="absolute top-[-0px] left-[26px] lg:top-[-38px] lg:left-[69px] w-[110px] h-[166px] lg:w-[153px] lg:h-[230px] object-cover"
            />

            <Button
              size="icon"
              className={`absolute top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 rounded-[30px] p-0 ${
                actualProduct === 3 ? "hidden" : ""
              }`}
            >
              <Plus className="text-white" />
            </Button>
          </div>
        </div> */}
      </section>

      <CustomizationModalSection
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={currentProduct.name}
        productId={currentProduct.id}
        handleChangeComplement={handleChangeComplement}
        complements={currentProduct.complements}
      />
    </>
  );
}
