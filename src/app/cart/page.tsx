"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CuponIcon,
} from "@/components/ui/icons";
import { ModalAddress } from "@/components/cart/modalAddress";

import { Address } from "@/types/address";
import { useCartStore, CartItem } from "@/store/cartStore";
import { useIsMounted } from "@/hooks/useIsMounted";
import { PhoneNumberInput } from "@/components/ui/inputPhone";
import { CustomizationModalCart } from "@/components/cart/customizationModalCart";
import useFormCart from "@/hooks/cart/useFormcart";
import { ConfirmDeleteModal } from "@/components/cart/confirmDeleteModal";
import { useStoreHours } from "@/hooks/useStoreHours";
import { StoreClosedModal } from "@/components/cart/storeClosedModal";
import { CartSummary } from "./CartSummary";

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
        <div className="absolute inset-0 z-500 bg-black/40 flex items-center justify-center">
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
                    className="w-full h-[100px] shadow-sm px-5 py-4 rounded-2xl border-[1.5px] border-[#cccccc] resize-none outline-none text-base font-normal text-neutrosblack-80 leading-[18px] tracking-[0] focus:border-[#808080]"
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
                    className={`cursor-pointer inline-flex flex-col items-start justify-center p-3 flex-[0_0_auto] rounded-[8px] transition-colors ${formData.paymentMethod === method.id
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
                        className={`relative w-4 h-4 rounded-[10px] ${formData.paymentMethod === method.id
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
                          className={`w-fit font-normal text-xs text-center leading-[18px] whitespace-nowrap ${formData.paymentMethod === method.id
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

        {/* Resumen del pedido */}
        <CartSummary
          items={items}
          formatCurrency={formatCurrency}
          isMounted={isMounted}
          getSubtotal={getSubtotal}
          getDeliveryFee={getDeliveryFee}
          getTotal={getTotal}
          handleEditComplements={handleEditComplements}
          removeComplement={removeComplement}
          handleDecrease={handleDecrease}
          handleIncrease={handleIncrease}
          addItem={addItem}
          isSubmitting={isSubmitting}
        />

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
