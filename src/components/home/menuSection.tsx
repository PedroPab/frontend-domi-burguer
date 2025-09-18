"use client";

import { Button } from "@/components/button";
import Image from "next/image";
import { ArrowIcon, EditarIcon, HamburgerIcon } from "@/components/icons";
import { Minus, Plus } from "lucide-react";
import { useMenu } from "@/hooks/home/useMenu";

export default function MenuSection() {
  const {
    // hook useMenu para manejar el producto actual y las funciones de navegación
    actualProduct,
    currentProduct,
    quantity,
    handleIncrease,
    handleDecrease,
    handleChangeProduct,
    handleNextProduct,
    handlePrevProduct,
  } = useMenu();

  return (
    <>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-0 max-w-[1440px] w-screen ">
        {/* Columna 1 */}
        <div className="flex flex-col items-start justify-center gap-2 bg-[linear-gradient(45deg,rgba(255,194,5,1)_0%,rgba(255,194,5,0.4)_100%)] max-w-[720px] w-full mx-auto relative">
          <div className="w-full h-[30px] xl:h-[14px]  " />

          <div className="w-full aspect-[1/1] relative">
            <div className="">
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 400px, 720px"
              />
            </div>
            <div className="w-full max-w-[720px] px-[13%] py-0 absolute top-[43%] left-0 flex justify-between">
              <Button
                variant="ghost"
                className="w-10 h-10 md:w-14 md:h-14 bg-accent-yellow-20 rounded-[30px] hover:bg-accentmikado-20 pr-5"
                onClick={handlePrevProduct}
              >
                <ArrowIcon className="w-5 h-5 rotate-180 text-neutral-black-80" />
              </Button>
              <Button
                variant="ghost"
                className="w-10 h-10 md:w-14 md:h-14 bg-accent-yellow-20 rounded-[30px] hover:bg-accentmikado-20 pl-5"
                onClick={handleNextProduct}
              >
                <ArrowIcon className="w-5 h-5 text-neutral-black-80" />
              </Button>
            </div>
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col items-center justify-center gap-14 p-20 bg-accent-yellow-10 max-w-[720px] w-full mx-auto">
          <div className="flex flex-col w-[400px] items-center gap-6">
            <div>
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
            <p className="text-center body-font max-w-[350px]">
              {currentProduct.body}
            </p>
            <Button
              variant="ghost"
              className="px-4 py-2 w-[177px] h-[40px] bg-accent-yellow-20 hover:bg-accent-yellow-40  rounded-[30px]"
            >
              PERSONALIZAR <EditarIcon className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex w-full max-w-[720px] items-center justify-center gap-6">
            <div
              className={`flex items-center justify-center gap-6 px-1.5 py-2 border rounded-[50px]  h-[48px] ${
                quantity < 10 ? "w-[142px]" : "w-[153px]"
              }`}
            >
              <Button
                variant="ghost"
                className="w-[38px] h-[38px] bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px]"
                onClick={handleDecrease}
              >
                <Minus />
              </Button>
              <span className="label-font">{quantity}</span>
              <Button
                variant="ghost"
                className="w-[38px] h-[38px] bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px]"
                onClick={handleIncrease}
              >
                <Plus />
              </Button>
            </div>
            <div>
              <h1 className="font-bold text-[28px] md:text-[32px] leading-[30px] md:leading-[28px] !important">
                ${currentProduct.price.toLocaleString("es-CO")}
              </h1>
            </div>
          </div>

          <div className="flex w-full max-w-[720px] items-center justify-center gap-6">
            <Button className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[199px] h-[48px]">
              <HamburgerIcon className="w-6 h-6" />
              PAGAR AHORA
            </Button>
            <Button
              variant="ghost"
              className="bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[199px] h-[48px]"
            >
              AÑADIR AL CARRITO
            </Button>
          </div>
        </div>
      </section>

      {/* Sección de miniaturas de productos */}
      <section className="grid lg:gap-y-14 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center lg:gap-6 gap-2 gap-x-4 py-14 relative">
        {/* Cada tarjeta representa un producto (ejemplo producto 0) */}
        <div
          className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 ${
            actualProduct === 0 ? "bg-accent-yellow-40" : "bg-accent-yellow-20"
          } rounded-2xl border-0 overflow-visible`}
        >
          <div
            className={` flex relative flex-col items-center justify-center gap-[4.47px] overflow-visible p-0 h-full`}
            onClick={() => handleChangeProduct(0)}
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
              className={`absolute top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 rounded-[30px] p-0 ${
                actualProduct === 0 ? "hidden" : ""
              }`}
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
            onClick={() => handleChangeProduct(1)}
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
              className={`absolute top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 rounded-[30px] p-0 ${
                actualProduct === 1 ? "hidden" : ""
              }`}
            >
              <Plus className="text-white" />
            </Button>
          </div>
        </div>
        <div
          className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 ${
            actualProduct === 2 ? "bg-accent-yellow-40" : "bg-accent-yellow-20"
          } rounded-2xl border-0 overflow-visible`}
          onClick={() => handleChangeProduct(2)}
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
              className={`absolute top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 rounded-[30px] p-0 ${
                actualProduct === 2 ? "hidden" : ""
              }`}
            >
              <Plus className="text-white" />
            </Button>
          </div>
        </div>
        <div
          className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 ${
            actualProduct === 3 ? "bg-accent-yellow-40" : "bg-accent-yellow-20"
          } rounded-2xl border-0 overflow-visible`}
          onClick={() => handleChangeProduct(3)}
        >
          <div className={`${"relative gap-[4.47px]"} p-0 h-full`}>
            <Image
              src="/DomiburgerPapitas2.png"
              alt="Burger"
              width={153} // ancho máximo (lg:w-[153px])
              height={230} // alto máximo (lg:h-[230px])
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
        </div>
      </section>
    </>
  );
}
