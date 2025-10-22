"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BancolombiaIcon,
  MoneyIcon,
  NequiIcon,
  SpikesIcon,
} from "@/components/ui/icons";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/products";
import { Complements } from "@/components/ui/complements";

export default function InfoOrder() {
  const paymentMethods = [
    {
      id: "cash",
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

  const [selectedMethod, setSelectedMethod] = useState("efectivo");

  const lastOrder =
    typeof window !== "undefined" ? localStorage.getItem("lastOrder") : null;
  console.log("Last Order from localStorage:", lastOrder);

  const items = lastOrder ? JSON.parse(lastOrder).orderItems : [];
  const address = lastOrder ? JSON.parse(lastOrder).address : null;
  const paymentMethod = lastOrder ? JSON.parse(lastOrder).paymentMethod : null;
  const prices = lastOrder ? JSON.parse(lastOrder).prices : null;

  return lastOrder ? (
    <div className="flex flex-col xl:flex-row w-full xl:justify-around items-center xl:items-start gap-5 mt-[130px] lg:mt-[130px] mb-[100px]">
      <div className="flex h-full w-full pb-10 max-w-[500px]">
        <div className="flex flex-col h-full gap-6 w-full mt-5">
          <div className="flex-col">
            <h2 className="items-start">INFORMACIÓN DE PAGO</h2>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <p className="body-font font-bold">Direccion de envío:</p>

            <Card className="gap-6 p-4 w-full bg-accent-yellow-10 rounded-[12px] shadow-none border-0">
              <CardContent className="p-0">
                <div className="flex justify-between gap-6 w-full">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <h5 className="body-font font-bold">{address.name}</h5>

                      <div className="body-font flex flex-col gap-1">
                        <span>
                          {address.city}, {address.country}
                        </span>
                        <span>{address.address}</span>
                        <span>{address.floor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <h2 className="">
                      ${address.deliveryPrice.toLocaleString("es-CO")}
                    </h2>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <h5 className="body-font font-bold">Método de pago</h5>
            {/* tendra que mostrarse solo la opcion que se eligio antes no todas las opciones de pago */}
            <div className="flex gap-5 xl:gap-2  w-full">
              {paymentMethods.filter((method) => method.id === paymentMethod).map((method) => (
                <label
                  key={method.id}
                  className={`cursor-pointer inline-flex flex-col items-start justify-center p-3 flex-[0_0_auto] rounded-[8px] transition-colors ${
                    selectedMethod === method.id
                      ? "bg-[#F7F7F7]"
                      : "bg-[#FFFFFF]"
                  }`}
                >
                  <div className="inline-flex items-center gap-4">
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
            <div className="flex h-10 items-center gap-4 px-4 py-2 bg-[#ecfce6] rounded-[12px] border border-solid border-[#68bc73]">
              <div className="flex justify-between gap-2 flex-1">
                <span className="font-normal text-neutral-black-80 text-sm tracking-[0] leading-[18px]">
                  Estado del pedido:
                </span>
                <div className="font-normal text-neutral-black-80 text-sm tracking-[0] leading-[18px]">
                  <span className="font-bold">En repartición</span>
                </div>
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
              </div>

              <div className="flex flex-col items-start gap-8 w-full">
                <div className="flex flex-col items-start gap-4 w-full">
                    {items.map((item: Product) => (
                      <Card
                        key={item.id}
                        className="flex w-full xl:h-28 items-start gap-4 pl-2 pr-3 xl:pr-4 py-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden border-0"
                      >
                        <CardContent className="p-0 flex w-full gap-4 items-center justify-start">
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

                          <div className="justify-center w-full max-w-[316px] gap-2 xl:gap-3 pt-1 pb-0 px-0 flex-1 grow flex flex-col items-start self-stretch">
                            <div className="flex gap-3 self-stretch w-full rounded-[80.62px] flex-col items-start">
                              <div className="gap-3 self-stretch w-full flex items-center">
                                <div className="flex-1 font-h4">
                                  {item.name}
                                </div>
                              </div>
                            </div>

                            <Complements
                              complements={item.complements}
                            />

                            <div className="flex h-8 items-center justify-between w-full rounded-[50px]">
                              <h4 className="">
                                ${item.price.toLocaleString("es-CO")}
                              </h4>

                              <h4 className="">
                                Cantidad: {item.quantity}
                              </h4>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                <Separator orientation="horizontal" className="w-full!" />
              </div>

              <div className="flex flex-col items-start gap-8 w-full">
                <div className="flex flex-col items-start gap-10 w-full rounded-xl">
                  <div className="flex flex-col items-start justify-end gap-4 w-full">
                    <div className="flex items-start gap-10 w-full">
                      <p className="flex-1 mt-[-0.93px] body-font">Subtotal</p>

                      <p className="w-fit mt-[-0.93px] body-font">${prices.subtotal.toLocaleString("es-CO")}</p>
                    </div>

                    <div className="flex items-start gap-10 w-full">
                      <div className="flex-1 mt-[-0.93px] font-body font-[number:var(--body-font-weight)] text-neutrosblack-80 text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] [font-style:var(--body-font-style)]">
                        Envío
                      </div>

                      <p className="w-fit body-font font-bold">{address.deliveryPrice.toLocaleString("es-CO")}</p>
                    </div>

                    <Separator orientation="horizontal" className="w-full!" />

                    <div className="flex items-center gap-10 w-full">
                      <p className="flex-1 body-font font-bold">Total</p>

                      <h2 className="w-fit mt-[-0.93px]">${prices.total.toLocaleString("es-CO")}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <SpikesIcon className="w-full rotate-180" />
        </Card>
      </div>
    </div>
  ) : <div className="h-[500px] w-full flex flex-col items-center justify-center mt-20">
    <h1 className="text-center mt-20">No hay ultimo pedido disponible.</h1>
  </div>;
}
