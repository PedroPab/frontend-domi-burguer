"use client";

import React, { useState, useEffect } from "react";
import { CalendarIcon, Pencil, PencilIcon, Plus } from "lucide-react";
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
import { ModalAddress } from "@/components/cart/modalAddress";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

import { Address, createEmptyAddress } from "@/types/address";
import { useCartStore } from "@/store/cartStore";
import { useIsMounted } from "@/hooks/useIsMounted";
import { PhoneNumberInput } from "@/components/ui/inputPhone";
import { Complements } from "@/components/ui/complements";

export default function Cart() {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("es-CO");
  };

  const isMounted = useIsMounted();

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
  // const benefits = [
  //   {
  //     icon: "/cupon.svg",
  //     text: "Cupones de descuento y sorpresas especiales solo para miembros.",
  //   },
  //   {
  //     icon: "/burger.svg",
  //     text: "Acceso más rápido a tus pedidos favoritos.",
  //   },
  //   {
  //     icon: "/map-pin.svg",
  //     text: "Seguimiento y soporte personalizado.",
  //   },
  // ];

  const {
    addItem,
    items,
    getSubtotal,
    getTotal,
    getDeliveryFee,
    updateQuantity,
    removeComplement,
    address: addressStore,
  } = useCartStore();

  const [selectedMethod, setSelectedMethod] = useState("efectivo"); // valor inicial

  const handleSelect = (id: string) => {
    setSelectedMethod(id);
  };

  const [quantity, setQuantity] = useState(1);

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  //Funciones para disminuir
  const handleDecrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity - 1);
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

  const [addressToEdit, setAddressToEdit] = useState<Address | null>(
    addressStore
  );

  const handleEditAddress = () => {
    setAddressToEdit(addressStore);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAddressToEdit(null);
  };

  useEffect(() => {
    console.log("Items en el carrito:", items);
  }, [items]);

  return (
    <div className="flex flex-col xl:flex-row w-full xl:justify-around items-center xl:items-start gap-5 mt-[130px] lg:mt-[130px] mb-[100px]">
      <div className="flex flex-col gap-14 pb-20 w-full lg:mt-4 max-w-[500px]">
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
                <Input
                  className="w-full"
                  placeholder="Correo Electrónico"
                ></Input>
                <PhoneNumberInput
                  className="pl-2 w-full"
                  id="phone-input"
                  placeholder="Escribe tu número de teléfono"
                  // El onChange recibe el valor en formato E.164 (+ código de país)
                  onChange={() => {
                    console.log(
                      "%ceste log se lo dedico a Gemini, que supo hacer el codigo mejor que ChatGPT",
                      "color: green; font-weight: bold;"
                    );
                  }}
                />
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
            {addressStore?.coordinates && addressStore?.country && (
              <Card className="gap-6 p-5 w-full bg-accent-yellow-10 rounded-[12px] shadow-none border-0">
                <CardContent className="p-0">
                  <div className="flex justify-between gap-6 w-full">
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-2">
                        <h5 className="body-font font-bold">
                          {addressStore.name}
                        </h5>

                        <div className="body-font flex flex-col gap-1">
                          <span>
                            {addressStore.city}, {addressStore.country}
                          </span>
                          <span>{addressStore.address}</span>
                          <span>{addressStore.floor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="flex flex-col">
                        <h2 className="flex-1">
                          $
                          {(addressStore.deliveryPrice ?? 0).toLocaleString(
                            "es-CO"
                          )}
                        </h2>
                        <span>{addressStore.kitchen}</span>
                      </div>

                      <Pencil
                        className="h-[18px] w-[18px] xl:mt-[2px] cursor-pointer hover:text-neutral-black-60"
                        onClick={handleEditAddress}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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

          {/* <div className="flex items-center justify-between w-full my-1">
            <label htmlFor="include-photo" className="body-font font-bold">
              Guardar datos para una próxima compra
            </label>
            <Switch id="include-photo" />
          </div> */}

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

      <div className="flex flex-col gap-8 max-w-[500px] justify-center w-full h-full">
        <Card className="flex-col shadow-none bg-transparent! rounded-2xl flex h-full w-full border-0">
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
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="flex w-full h-28 items-start gap-4 pl-2 pr-4 py-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden border-0"
                    >
                      <CardContent className="p-0 flex w-full gap-4">
                        <div className="w-24 h-24 min-w-24 bg-accent-yellow-40 rounded-[7.66px] relative">
                          <Image
                            src={item.image1}
                            alt="Burger"
                            width={67}
                            height={105}
                            className={
                              item.name.toLowerCase().includes("salsa")
                                ? "absolute top-[5px] left-[3px] w-[118px] h-[85px] object-cover overflow-visible"
                                : `object-cover absolute ${
                                    item.image2
                                      ? "left-[5px] top-[-5px]"
                                      : "top-[-5px] left-[15px]"
                                  }`
                            }
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

                        <div className="justify-center max-w-[316px] gap-3 pt-1 pb-0 px-0 flex-1 grow flex flex-col items-start self-stretch">
                          <div className="flex gap-3 self-stretch w-full rounded-[80.62px] flex-col items-start">
                            <div className="gap-3 self-stretch w-full flex items-center">
                              <div className="flex-1 font-h4">{item.name}</div>

                              <PencilIcon className="w-4 h-4" />
                            </div>
                          </div>

                          <Complements
                            complements={item.complements}
                            onRemove={(complementId) =>
                              removeComplement(item.id, complementId)
                            }
                          />

                          <div className="flex h-8 items-center justify-between w-full rounded-[50px]">
                            <h4 className="">
                              ${item.price.toLocaleString("es-CO")} X{" "}
                              {item.quantity}
                            </h4>

                            <QuantitySelector
                              size="sm"
                              value={item.quantity}
                              onDecrease={() =>
                                handleDecrease(item.id, item.quantity)
                              }
                              onIncrease={() =>
                                handleIncrease(item.id, item.quantity)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator orientation="horizontal" className="w-full!" />

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

                      <p className="w-fit mt-[-0.93px] body-font">
                        ${isMounted ? formatCurrency(getSubtotal()) : "0"}
                      </p>
                    </div>

                    <div className="flex items-start gap-10 w-full">
                      <div className="flex-1 mt-[-0.93px] font-body font-[number:var(--body-font-weight)] text-neutrosblack-80 text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] [font-style:var(--body-font-style)]">
                        Envío
                      </div>

                      <p className="w-fit body-font font-bold">
                        ${isMounted ? formatCurrency(getDeliveryFee()) : "0"}
                      </p>
                    </div>

                    <Separator orientation="horizontal" />

                    <div className="flex items-center gap-10 w-full">
                      <p className="flex-1 body-font font-bold">Total</p>

                      <h2 className="w-fit mt-[-0.93px]">
                        ${isMounted ? formatCurrency(getTotal()) : "0"}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-end gap-6 w-full">
                  <Link href={"/thankyou"}>
                    <Button className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[128px] h-[48px]">
                      COMPRAR
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
          <SpikesIcon className="w-full rotate-180" />
        </Card>
      </div>
      <ModalAddress
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        addressToEdit={addressToEdit}
      />
    </div>
  );
}
