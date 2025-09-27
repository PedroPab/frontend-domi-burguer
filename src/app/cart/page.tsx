"use client";

import React, { useState } from "react";
import { CalendarIcon, PencilIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BancolombiaIcon,
  CuponIcon,
  HamburgerIcon,
  MapPinIcon,
  MoneyIcon,
  NequiIcon,
  ShieldIcon,
  SpikesIcon,
} from "@/components/ui/icons";
import { QuantitySelector } from "@/components/ui/quantitySelector";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ModalAddress } from "@/components/modalAddress";
import { Switch } from "@/components/ui/switch";

export default function Cart() {
  const userDataFields = [
    {
      value: "Pepito Mendieta",
      hasCheck: true,
      fullWidth: true,
    },
    {
      value: "pepito@correo.com",
      hasCheck: true,
      fullWidth: false,
    },
    {
      value: "+57 322 234 56 78",
      hasCheck: true,
      fullWidth: false,
    },
  ];

  const paymentMethods = [
    {
      id: "efectivo",
      label: "Efectivo",
      iconClass: "w-[38px] h-[32px]",
      icon: MoneyIcon,
      selected: true,
    },
    {
      id: "bancolombia",
      label: "Bancolombia",
      iconClass: "w-[28px] h-[28px]",
      icon: BancolombiaIcon,
      selected: false,
    },
    {
      id: "nequi",
      label: "Nequi",
      iconClass: "w-[36px] h-[25px]",
      icon: NequiIcon,
      selected: false,
    },
  ];

  const orderItems = [
    // {
    //   id: 1,
    //   name: "COMBO ESPECIAL",
    //   price: "$29.900",
    //   quantity: "01",
    //   image1: "/burger-1-2.png",
    //   image2: "/domiburger-papitas-3.png",
    //   modifications: [
    //     { icon: "/pickles.svg", text: "0 Pepinillos" },
    //     { icon: "/lechuga.svg", text: "0 lechuga" },
    //     { icon: "/carne.svg", text: "2 Carne (+$6.000)" },
    //   ],
    // },
    {
      id: 2,
      name: "COMBO ESPECIAL",
      price: "$29.900",
      quantity: "01",
      image1: "/burgerSmall.png",
      image2: "/papitasSmall.png",
      modifications: [{ icon: "/carne.svg", text: "2 Carne (+$6.000)" }],
    },
    {
      id: 4,
      name: "PORCIÓN PAPITAS RIZADAS",
      price: "$6.900",
      quantity: "01",
      image1: "/papitasSmall.png",
      image2: null,
      modifications: [],
    },
  ];

  const benefits = [
    {
      icon: "/cupon.svg",
      text: "Cupones de descuento y sorpresas especiales solo para miembros.",
    },
    {
      icon: "/burger.svg",
      text: "Acceso más rápido a tus pedidos favoritos.",
    },
    {
      icon: "/map-pin.svg",
      text: "Seguimiento y soporte personalizado.",
    },
  ];

  const [selectedMethod, setSelectedMethod] = useState("efectivo"); // valor inicial

  const handleSelect = (id: string) => {
    setSelectedMethod(id);
  };

  const [quantity, setQuantity] = useState(1);

  //Funciones para aumentar
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  //Funciones para disminuir
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // evita bajar de 1
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handleEditProduct = (productName?: string) => {
    if (productName) {
      setSelectedProduct(productName);
    } else {
      setSelectedProduct("");
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col xl:flex-row w-full items-center xl:justify-around gap-5 mt-[130px] lg:mt-[130px] mb-[100px]">
      <div className="flex flex-col items-center gap-14 pb-20 w-full justify-center max-w-[500px]">
        <div className="flex flex-col gap-6 w-full">
          <div className="inline-flex gap-4 flex-col">
            <h2 className="items-start">INFORMACIÓN DE PAGO</h2>
            <p className="body-font">
              Completa el siguiente formulario con tu información.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <h5 className="body-font font-bold">Tus datos</h5>

            <div className="inline-flex flex-col gap-2 items-start w-full">
              <Input className="" placeholder="Nombres y Apellidos"></Input>

              <div className="flex flex-col lg:flex-row w-full gap-2">
                <Input className="" placeholder="Correo Electrónico"></Input>
                <Input className="" placeholder="+57 000 000 00 00"></Input>
              </div>

              <div className="relative w-full">
                <textarea
                  maxLength={200}
                  placeholder="Algún comentario?"
                  className="w-full h-[100px] shadow-sm px-5 py-4 rounded-2xl border-[1.5px] border-[#cccccc] resize-none outline-none [font-family:'Montserrat',Helvetica] font-normal text-neutrosblack-80 text-sm leading-[18px] tracking-[0]"
                />
                <span className="absolute bottom-3 right-3 text-gray-400 text-sm pointer-events-none">
                  23/200
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <p className="body-font font-bold">¡Necesitamos tu dirección!</p>
            <Button
              variant="ghost"
              className="bg-accent-yellow-20 hover:bg-accent-yellow-40 active:bg-accent-yellow-40 rounded-[30px] flex items-center gap-2 xl:w-[260px] xl:h-[48px] h-[40px] w-full label-font"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus /> AGREGAR DIRECCIÓN
            </Button>
            {/* direccion ya creada */}
            {/* <Card className="gap-6 p-4 w-full bg-accent-yellow-10 rounded-[12px] shadow-none border-0">
              <CardContent className="p-0">
                <div className="flex justify-between gap-6 w-full">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <h5 className="body-font font-bold">Casa de mamá</h5>

                      <div className="body-font">
                        Medellín, Antioquia
                        <br />
                        Cra 66 # 33 - 77
                        <br />
                        Int 6 Apto 606
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <h2 className="">$4.400</h2>

                    <Pencil className="h-[18px] w-[18px] xl:mt-[2px]" />
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <h5 className="body-font font-bold">Método de pago</h5>

            <div className="flex gap-5 xl:gap-2  w-full">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`cursor-pointer inline-flex flex-col items-start justify-center p-3 flex-[0_0_auto] rounded-[8px] transition-colors ${
                    selectedMethod === method.id
                      ? "bg-[#F7F7F7]"
                      : "bg-[#FFFFFF]"
                  }`}
                >
                  {/* input radio oculto */}
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => handleSelect(method.id)}
                    className="hidden"
                  />

                  <div className="inline-flex items-center gap-4">
                    <div
                      className={`relative w-4 h-4 rounded-[10px] ${
                        selectedMethod === method.id
                          ? "bg-neutral-black-80"
                          : "bg-[#FFFFFF] border-2 border-solid border-[#cccccc]"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="relative top-[calc(50.00%_-_3px)] left-[calc(50.00%_-_3px)] w-1.5 h-1.5 bg-[#FFFFFF] rounded-[10px]" />
                      )}
                    </div>
                    <div className="flex flex-col xl:flex-row xl:gap-2 items-center">
                      <method.icon className={method.iconClass} />

                      <div
                        className={`w-fit font-normal text-xs text-center leading-[18px] whitespace-nowrap ${
                          selectedMethod === method.id
                            ? "text-neutral-black-80"
                            : "text-neutral-black-50"
                        }`}
                      >
                        {method.label}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between w-full my-1">
            <label htmlFor="include-photo" className="body-font font-bold">
              Guardar datos para una próxima compra
            </label>
            <Switch id="include-photo" />
          </div>

          <Card className="flex flex-col items-start h-[209px] p-6 w-full bg-neutral-black-30 rounded-[12px] border-0">
            <CardContent className="p-0 w-full">
              <h5 className="mt-[-1.00px] body-font font-bold mb-4">
                ¿Por qué guardar tus datos?
              </h5>

              <p className="body-font mb-4">
                Accede a beneficios exclusivos como:
              </p>

              <div className="inline-flex flex-col gap-3 items-start mr-[-16.00px]">
                <div className="flex w-full items-center gap-4">
                  <CuponIcon className="" />

                  <p className=" body-font text-[15px]!">
                    Cupones de descuento y sorpresas especiales solo para
                    miembros.
                  </p>
                </div>
                <div className="flex w-full items-center  gap-4">
                  <HamburgerIcon width={16} height={16} />

                  <p className=" body-font text-[15px]!">
                    Acceso más rápido a tus pedidos favoritos.
                  </p>
                </div>
                <div className="flex w-full items-center  gap-4">
                  <MapPinIcon width={16} height={16} />

                  <p className=" body-font text-[15px]!">
                    Acceso más rápido a tus pedidos favoritos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 w-full rounded-xl">
            <div className="flex flex-col w-full items-start justify-center gap-6">
              <div className="flex items-center gap-3 w-full">
                <ShieldIcon />

                <p className="body-font">
                  Guardaremos tu información de forma segura
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-8 max-w-[500px]">
        <Card className="flex-col shadow-none bg-transparent! rounded-2xl flex items-start w-full border-0">
          <SpikesIcon className="w-full" />
          <CardContent className="p-0 w-full">
            <div className="px-6 py-2 bg-accent-yellow-10 flex flex-col items-start gap-8 w-full">
              <div className="inline-flex flex-col gap-4 items-start w-full">
                <h2 className="mt-[-1.00px]">RESUMEN DEL PEDIDO</h2>

                <div className="w-full h-8 gap-4 flex items-center">
                  <p className="body-font font-bold flex-1">
                    Programar el envío de mi pedido
                  </p>

                  <Button
                    variant="outline"
                    className="bg-accent-yellow-10 inline-flex px-3 py-2 rounded-[20px] border-[1.5px] border-solid border-[#313131] items-center justify-center gap-2 h-auto"
                  >
                    <div className="w-fit font-bold [font-family:'Montserrat',Helvetica] text-neutral-black-80 text-xs leading-[18px] ">
                      PROGRAMAR
                    </div>

                    <CalendarIcon className="w-[15px] h-[15px]" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-start gap-8 w-full">
                <div className="flex flex-col items-start gap-4 w-full">
                  {orderItems.map((item) => (
                    <Card
                      key={item.id}
                      className="flex w-full h-28 items-start gap-4 pl-2 pr-4 py-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden border-0"
                    >
                      <CardContent className="p-0 flex w-full gap-4">
                        <div className="w-24 h-24 bg-accent-yellow-40 rounded-[7.66px] relative">
                          <Image
                            src={item.image1}
                            alt="Burger"
                            width={67}
                            height={105}
                            className={`object-cover absolute  ${
                              item.image2
                                ? "left-[5px] top-[-5]"
                                : "top-[5px] left-[15px]"
                            }`}
                          />

                          {item.image2 && (
                            <Image
                              src={item.image2}
                              alt="Domiburger papitas"
                              width={57}
                              height={84}
                              className="object-cover absolute top-5 left-[41px]"
                            />
                          )}
                        </div>

                        <div className="justify-center gap-3 pt-1 pb-0 px-0 flex-1 grow flex flex-col items-start self-stretch">
                          <div className="flex gap-3 self-stretch w-full rounded-[80.62px] flex-col items-start">
                            <div className="gap-3 self-stretch w-full flex items-center">
                              <div className="flex-1 font-h4">{item.name}</div>

                              <PencilIcon className="w-4 h-4" />
                            </div>
                          </div>

                          {/* {item.modifications.length > 0 && (
                            <div className="flex flex-wrap gap-[4px_4px] self-stretch w-full items-start">
                              {item.modifications.map((mod, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="inline-flex h-5 items-center justify-center gap-1 px-1.5 py-2 rounded-[30px] border border-solid border-[#808080]"
                                >
                                  <img
                                    className="w-3 h-3 mt-[-4.00px] mb-[-4.00px]"
                                    alt="Modification"
                                    src={mod.icon}
                                  />

                                  <div className="text-neutrosblack-80 leading-[18px] w-fit mt-[-2.00px] [font-family:'Montserrat',Helvetica] font-normal text-[8px] tracking-[0] whitespace-nowrap">
                                    {mod.text}
                                  </div>

                                  <XIcon className="w-3 h-3 mt-[-4.00px] mb-[-4.00px]" />
                                </Badge>
                              ))}
                            </div>
                          )} */}

                          <div className="flex h-8 items-center justify-between w-full rounded-[50px]">
                            <h4 className="">{item.price}</h4>

                            <QuantitySelector
                              size="sm"
                              value={quantity}
                              onDecrease={handleDecrease}
                              onIncrease={handleIncrease}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator orientation="horizontal" />

                <h2 className="">ACOMPAÑA TU BURGER</h2>

                <Card className="flex w-full h-28 items-start gap-4 pl-2 pr-4 py-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden border-0">
                  <CardContent className="p-0 flex w-full gap-4">
                    <div className="w-24 h-24 bg-accent-yellow-40 rounded-[7.66px] relative">
                      <Image
                        src="/salsaSmall.png"
                        alt="Burger"
                        width={118}
                        height={85}
                        className="absolute top-[5px] left-[3px] w-[118px] h-[85px] object-cover overflow-visible"
                      />
                    </div>

                    <div className="justify-center gap-3 pt-1 pb-0 px-0 flex-1 grow flex flex-col items-start self-stretch">
                      <div className="flex gap-3 self-stretch w-full rounded-[80.62px] flex-col items-start">
                        <div className="gap-3 self-stretch w-full flex items-center">
                          <div className="flex-1 font-h4">
                            SALSA DE AJO DE LA CASA
                          </div>
                        </div>
                      </div>

                      <div className="flex h-8 items-center justify-between w-full rounded-[50px]">
                        <h4 className="">$25.000</h4>

                        <Button
                          size="icon"
                          className={` w-10 h-10  rounded-[30px] p-0`}
                        >
                          <Plus className="text-white" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col items-start gap-8 w-full">
                <div className="flex flex-col items-start gap-10 w-full rounded-xl">
                  <div className="flex flex-col items-start justify-end gap-4 w-full">
                    <div className="flex items-start gap-10 w-full">
                      <p className="flex-1 mt-[-0.93px] body-font">Subtotal</p>

                      <p className="w-fit mt-[-0.93px] body-font">$ 36.800</p>
                    </div>

                    <div className="flex items-start gap-10 w-full">
                      <div className="flex-1 mt-[-0.93px] font-body font-[number:var(--body-font-weight)] text-neutrosblack-80 text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] [font-style:var(--body-font-style)]">
                        Envío
                      </div>

                      <p className="w-fit body-font font-bold">Total</p>
                    </div>

                    <Separator orientation="horizontal" />

                    <div className="flex items-center gap-10 w-full">
                      <p className="flex-1 body-font font-bold">Total</p>

                      <h2 className="w-fit mt-[-0.93px]">$36.800</h2>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-end gap-6 w-full">
                  <Button className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[128px] h-[48px]">
                    COMPRAR
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <SpikesIcon className="w-full rotate-180" />
        </Card>
      </div>
      <ModalAddress
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
