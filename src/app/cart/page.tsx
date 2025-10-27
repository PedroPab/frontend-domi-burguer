"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  Loader2,
  Pencil,
  PencilIcon,
  Plus,
  Trash2,
} from "lucide-react";
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

import { Address } from "@/types/address";
import { useCartStore, CartItem } from "@/store/cartStore";
import { useIsMounted } from "@/hooks/useIsMounted";
import { PhoneNumberInput } from "@/components/ui/inputPhone";
import { Complements } from "@/components/ui/complements";
import { CustomizationModalCart } from "@/components/cart/customizationModalCart";
import useFormCart from "@/hooks/cart/useFormcart";
import Link from "next/link";
import Tooltip from "@/components/ui/tooltip";
import { ConfirmDeleteModal } from "@/components/cart/confirmDeleteModal";
import { useStoreHours } from "@/hooks/useStoreHours";
import { StoreClosedModal } from "@/components/cart/storeClosedModal";

export default function Cart() {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("es-CO");
  };

  const isMounted = useIsMounted();

  const {
    items,
    getSubtotal,
    getTotal,
    getDeliveryFee,
    updateQuantity,
    removeComplement,
    address: addressStore,
    removeAddress,
    addItem,
  } = useCartStore();

  const {
    formData,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    paymentMethods,
    isSubmitting,
    error,
  } = useFormCart();

  const storeStatus = useStoreHours();

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity === 1) {
      // Si la cantidad es 1, mostrar modal de confirmación
      const item = items.find((item) => item.id === id);
      if (item) {
        setItemToDelete({ id: item.id, name: item.name });
        setIsDeleteModalOpen(true);
      }
    } else {
      // Si la cantidad es mayor a 1, disminuir normalmente
      updateQuantity(id, quantity - 1);
    }
  };

  const [isStoreClosedModalOpen, setIsStoreClosedModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalComplementsOpen, setIsModalComplementsOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      updateQuantity(itemToDelete.id, 0);
      setItemToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
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

  const handleEditComplements = (item: CartItem) => {
    setSelectedCartItem(item);
    setIsModalComplementsOpen(true);
  };

  const handleCloseComplementsModal = () => {
    setIsModalComplementsOpen(false);
    setSelectedCartItem(null);
  };

  useEffect(() => {
    console.log("Items en el carrito:", items);
  }, [items]);

  const handleSubmitWithValidation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Verificar si la tienda está abierta
    if (!storeStatus.isOpen) {
      setIsStoreClosedModalOpen(true);
      return;
    }

    // Si está abierta, proceder con el submit normal
    await handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmitWithValidation}>
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-red" size={70} />
        </div>
      )}
      <div className="flex flex-col xl:flex-row w-full xl:justify-around items-center xl:items-start gap-5 mt-[130px] lg:mt-[130px] mb-[100px]">
        <div className="flex flex-col gap-14 pb-20 w-full lg:mt-4 max-w-[500px]">
          <div className="flex flex-col gap-6 w-full">
            <div className="inline-flex gap-4 flex-col">
              <h2 className="items-start">INFORMACIÓN DE PAGO</h2>
              <p className="body-font">
                Completa el siguiente formulario con tu información.
              </p>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full">
              <h5 className="body-font font-bold">Tus datos</h5>

              <div className="inline-flex flex-col gap-2 items-start w-full">
                <Input
                  id="name"
                  name="name"
                  maxLength={70}
                  placeholder="Nombres y Apellidos"
                  onChange={handleChange}
                  value={formData.name}
                />

                <div className="flex flex-col lg:flex-row w-full gap-2">
                  <PhoneNumberInput
                    className="pl-2 w-full"
                    id="phone"
                    name="phone"
                    maxLength={20}
                    placeholder="Escribe tu número de teléfono"
                    onChange={handlePhoneChange}
                    value={formData.phone}
                  />
                </div>

                <div className="relative w-full">
                  <textarea
                    id="comment"
                    name="comment"
                    onChange={handleChange}
                    value={formData.comment}
                    maxLength={200}
                    placeholder="Algún comentario?"
                    className="w-full h-[100px] shadow-sm px-5 py-4 rounded-2xl border-[1.5px] border-[#cccccc] resize-none outline-none [font-family:'Montserrat',Helvetica] font-normal text-neutrosblack-80 text-sm leading-[18px] tracking-[0] focus:border-[#808080]"
                  />
                  <span className="absolute bottom-3 right-3 text-gray-400 text-sm pointer-events-none">
                    {formData.comment.length}/200
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <p className="body-font font-bold">¡Necesitamos tu dirección!</p>
              {addressStore?.coordinates && addressStore?.country ? null : (
                <Button
                  type="button"
                  variant="ghost"
                  className="bg-accent-yellow-20 hover:bg-accent-yellow-40 active:bg-accent-yellow-40 rounded-[30px] flex items-center gap-2 xl:w-[260px] xl:h-[48px] h-[40px] w-full label-font"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus /> AGREGAR DIRECCIÓN
                </Button>
              )}
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

                        <div className="flex flex-col justify-between">
                          <Pencil
                            className="h-[18px] w-[18px] xl:mt-[2px] cursor-pointer hover:text-neutral-black-60"
                            onClick={handleEditAddress}
                          />
                          <Trash2
                            className="h-[18px] w-[18px] xl:mt-[2px] cursor-pointer text-red-500 hover:text-red-700"
                            onClick={() => removeAddress()}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full">
              <h5 className="body-font font-bold">Método de pago</h5>

              <div className="flex flex-wrap justify-around gap-3 sm:gap-4 md:gap-5 w-full">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`cursor-pointer inline-flex flex-col items-start justify-center p-3 flex-[0_0_auto] rounded-[8px] transition-colors ${
                      formData.paymentMethod === method.id
                        ? "bg-accent-yellow-10"
                        : "bg-[#FFFFFF]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      id={method.id}
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="inline-flex items-center gap-4">
                      <div
                        className={`relative w-4 h-4 rounded-[10px] ${
                          formData.paymentMethod === method.id
                            ? "bg-primary-red-60"
                            : "bg-[#FFFFFF] border-2 border-solid border-[#cccccc]"
                        }`}
                      >
                        {formData.paymentMethod === method.id && (
                          <div className="relative top-[calc(50.00%_-_3px)] left-[calc(50.00%_-_3px)] w-1.5 h-1.5 bg-[#FFFFFF] rounded-[10px]" />
                        )}
                      </div>
                      <div className="flex flex-col xl:flex-row xl:gap-2 items-center">
                        <method.icon className={method.iconClass} />

                        <div
                          className={`w-fit font-normal text-xs text-center leading-[18px] whitespace-nowrap ${
                            formData.paymentMethod === method.id
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

            {/* <Card className="flex flex-col items-start min-h-[209px]  p-6 w-full bg-neutral-black-30 rounded-[12px] border-0">
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
            </Card> */}

            {/* <div className="flex items-start gap-2 w-full rounded-xl">
              <div className="flex flex-col w-full items-start justify-center gap-6">
                <div className="flex items-center gap-3 w-full">
                  <ShieldIcon />
                  <p className="body-font">
                    Guardaremos tu información de forma segura
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="flex flex-col gap-8 max-w-[500px] justify-center w-full h-full">
          <Card className="flex-col shadow-none bg-transparent! rounded-2xl flex h-full w-full border-0">
            <SpikesIcon className="w-full" />
            <CardContent className="p-0 w-full">
              <div className="px-4 xl:px-6 py-2 bg-accent-yellow-10 flex flex-col items-start gap-8 w-full">
                <div className="inline-flex flex-col gap-4 items-start w-full">
                  <h2 className="mt-[-1.00px]">RESUMEN DEL PEDIDO</h2>

                  <div className="w-full h-8 gap-4 flex items-center">
                    <p className="body-font font-bold flex-1">
                      Programar el envío de mi pedido
                    </p>
                    <Tooltip text="Proximamente">
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-accent-yellow-10 inline-flex px-3 py-2 rounded-[20px] border-[1.5px] border-solid border-[#313131] items-center justify-center gap-2 h-auto"
                        disabled={true}
                      >
                        <div className="w-fit font-bold [font-family:'Montserrat',Helvetica] text-neutral-black-80 text-xs leading-[18px] ">
                          PROGRAMAR
                        </div>
                        <CalendarIcon className="w-[15px] h-[15px]" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-8 w-full">
                  <div className="flex flex-col items-start gap-4 w-full">
                    {items.map((item) => (
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
                                {item.name.includes("SALSA DE AJO") ? null : (
                                  <PencilIcon
                                    className="w-4 h-4 cursor-pointer hover:text-neutral-black-60 transition-colors"
                                    onClick={() => handleEditComplements(item)}
                                  />
                                )}
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

                    {items.length === 0 && (
                      <>
                        <div className="flex flex-col items-center justify-center w-full py-4">
                          <h3 className="text-xl text-neutral-black-60">
                            No hay productos en el carrito
                          </h3>
                          <Link
                            href={"/"}
                            className="focus:outline-0! focus:ring-0!"
                          >
                            <Button
                              type="button"
                              className="text-white! rounded-[30px] flex items-center gap-2 w-[260px] xl:w-[260px] xl:h-[48px] h-[40px] label-font mt-4 shadow-none"
                              onClick={() => setIsModalOpen(true)}
                            >
                              <Plus /> AGREGAR PRODUCTOS
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator orientation="horizontal" className="w-full!" />

                  {!items.some((item) =>
                    item.name.toLowerCase().includes("salsa")
                  ) && (
                    <>
                      <h2 className="">ACOMPAÑA TU BURGER</h2>

                      <Card className="flex w-full h-28 items-start gap-4 pl-2 pr-4 py-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden border-0">
                        <CardContent className="p-0 flex w-full gap-4">
                          <div className="w-24 h-24 bg-accent-yellow-40 rounded-[7.66px] relative">
                            <Image
                              src="/salsaSmall.png"
                              alt="Salsa"
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
                                type="button"
                                size="icon"
                                className="w-10 h-10 rounded-[30px] p-0"
                                onClick={() => {
                                  const salsaItem = {
                                    id: "product-38",
                                    productId: 38,
                                    name: "SALSA DE AJO DE LA CASA",
                                    price: 25000,
                                    basePrice: 25000,
                                    quantity: 1,
                                    image1: "/salsaSmall.png",
                                    complements: [],
                                  };
                                  addItem(salsaItem);
                                }}
                              >
                                <Plus className="text-white" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                <div className="flex flex-col items-start gap-8 w-full">
                  <div className="flex flex-col items-start gap-10 w-full rounded-xl">
                    <div className="flex flex-col items-start justify-end gap-4 w-full">
                      <div className="flex items-start gap-10 w-full">
                        <p className="flex-1 mt-[-0.93px] body-font">
                          Subtotal
                        </p>

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
                    <Button
                      type="submit"
                      disabled={isSubmitting || items.length === 0}
                      className={`text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[128px] h-[48px] disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSubmitting ? "w-auto" : "w-[128px]"
                      }`}
                    >
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
          onClose={handleCloseModal}
          addressToEdit={addressToEdit}
        />

        {selectedCartItem && (
          <CustomizationModalCart
            isOpen={isModalComplementsOpen}
            onClose={handleCloseComplementsModal}
            cartItem={selectedCartItem}
          />
        )}

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          productName={itemToDelete?.name || ""}
        />

        <StoreClosedModal
          isOpen={isStoreClosedModalOpen}
          onClose={() => setIsStoreClosedModalOpen(false)}
          message={storeStatus.message}
          opensAt={storeStatus.opensAt}
        />
      </div>
    </form>
  );
}
