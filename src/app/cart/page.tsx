"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ModalAddress } from "@/components/cart/modalAddress";
import { useCartStore } from "@/store/cartStore";
import { useIsMounted } from "@/hooks/useIsMounted";
import { PhoneNumberInput } from "@/components/ui/inputPhone";
import { CustomizationModalCart } from "@/components/cart/customizationModalCart";
import { ConfirmDeleteModal } from "@/components/cart/confirmDeleteModal";
import { StoreClosedModal } from "@/components/cart/storeClosedModal";
import { CartSummary } from "./CartSummary";

// Custom Hooks
import { useCartActions } from "@/hooks/cart/useCartActions";
import { useAddressManagement } from "@/hooks/cart/useAddressManagement";
import { useComplementsModal } from "@/hooks/cart/useComplementsModal";
import { useCartSubmit } from "@/hooks/cart/useCartSubmit";

export default function Cart() {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("es-CO");
  };

  const isMounted = useIsMounted();
  const { user } = useAuth();
  const { getSubtotal, getTotal, getDeliveryFee } = useCartStore();

  // Custom Hooks - Toda la lógica separada
  const {
    items,
    handleIncrease,
    handleDecrease,
    handleConfirmDelete,
    handleCloseDeleteModal,
    removeComplement,
    addItem,
    itemToDelete,
    isDeleteModalOpen,
  } = useCartActions();

  const {
    addressStore,
    isModalOpen,
    addressToEdit,
    handleEditAddress,
    handleCloseModal,
    handleOpenModal,
    removeAddress,
  } = useAddressManagement();

  const {
    isModalComplementsOpen,
    selectedCartItem,
    handleEditComplements,
    handleCloseComplementsModal,
  } = useComplementsModal();

  const {
    formData,
    handleChange,
    handlePhoneChange,
    handleSubmitWithValidation,
    paymentMethods,
    isSubmitting,
    error,
    storeStatus,
    isStoreClosedModalOpen,
    handleCloseStoreModal,
  } = useCartSubmit();

  return (
    <form onSubmit={handleSubmitWithValidation}>
      {isSubmitting && (
        <div className="absolute inset-0 z-500 bg-black/40 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-red" size={70} />
        </div>
      )}

      <div className="flex flex-col xl:flex-row w-full xl:justify-around items-center xl:items-start gap-5 mt-[130px] lg:mt-[130px] mb-[100px]">
        <div className="flex flex-col gap-14 pb-6 w-full lg:mt-4 max-w-[500px]">
          <div className="flex flex-col gap-6 w-full">
            {/* Header */}
            <div className="inline-flex gap-4 flex-col">
              <h2 className="items-start">INFORMACIÓN DE COMPRA</h2>
              <p className="body-font">
                Completa el siguiente formulario con tu información.
              </p>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Datos del usuario */}
            <div className="flex flex-col gap-4 w-full">
              <h5 className="body-font font-bold">Tus datos</h5>

              {user && (
                <div className="p-4 mb-2 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">Usuario autenticado:</span>
                    {user.displayName || user.email}
                  </div>
                  <p className="text-sm">Tus datos se han autocompletado</p>
                </div>
              )}

              <div className="inline-flex flex-col gap-2 items-start w-full">
                <Input
                  id="name"
                  name="name"
                  maxLength={70}
                  placeholder="Nombres y Apellidos"
                  onChange={handleChange}
                  value={formData.name}
                  disabled={!!(user && user.displayName)}
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
                    disabled={!!(user && user.phoneNumber)}
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

            {/* Dirección */}
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between">
                <p className="body-font font-bold">¡Necesitamos tu dirección!</p>
                {user && (
                  <span className="text-sm text-primary-red">
                    Usando dirección personal
                  </span>
                )}
              </div>

              {!addressStore?.coordinates || !addressStore?.country ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="bg-accent-yellow-20 hover:bg-accent-yellow-40 active:bg-accent-yellow-40 rounded-[30px] flex items-center gap-2 xl:w-[260px] xl:h-[48px] h-[40px] w-full label-font"
                  onClick={handleOpenModal}
                >
                  <Plus />{" "}
                  {user ? "AGREGAR DIRECCIÓN PERSONAL" : "AGREGAR DIRECCIÓN"}
                </Button>
              ) : (
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

            {/* Método de pago */}
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

        {/* Modales */}
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
          onClose={handleCloseStoreModal}
          message={storeStatus.message}
          opensAt={storeStatus.opensAt}
        />
      </div>
    </form>
  );
}