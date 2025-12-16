"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { useIsMounted } from "@/hooks/useIsMounted";

// Custom Hooks
import { useCartActions } from "@/hooks/cart/useCartActions";
import { useAddressManagement } from "@/hooks/cart/useAddressManagement";
import { useComplementsModal } from "@/hooks/cart/useComplementsModal";
import { useCartSubmit } from "@/hooks/cart/useCartSubmit";

// Components
import { LoadingOverlay } from "@/components/cart/loadingOverlay";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { CartSummary } from "./CartSummary";
import { CartModals } from "@/components/cart/CartModals";

export default function Cart() {
  // Utils
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("es-CO");
  };

  // Context & Store
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
    isModalOpen: isAddressModalOpen,
    addressToEdit,
    handleEditAddress,
    handleCloseModal: handleCloseAddressModal,
    handleOpenModal: handleOpenAddressModal,
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
      <LoadingOverlay isLoading={isSubmitting} />

      <div className="flex flex-col xl:flex-row w-full xl:justify-around items-center xl:items-start gap-5 mt-[130px] lg:mt-[130px] mb-[100px]">
        {/* Formulario de checkout */}
        <CheckoutForm
          user={user}
          error={error}
          formData={formData}
          handleChange={handleChange}
          handlePhoneChange={handlePhoneChange}
          addressStore={addressStore}
          onOpenAddressModal={handleOpenAddressModal}
          onEditAddress={handleEditAddress}
          onRemoveAddress={removeAddress}
          paymentMethods={paymentMethods}
        />

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

        {/* Todos los modales */}
        <CartModals
          isAddressModalOpen={isAddressModalOpen}
          onCloseAddressModal={handleCloseAddressModal}
          addressToEdit={addressToEdit}
          isComplementsModalOpen={isModalComplementsOpen}
          onCloseComplementsModal={handleCloseComplementsModal}
          selectedCartItem={selectedCartItem}
          isDeleteModalOpen={isDeleteModalOpen}
          onCloseDeleteModal={handleCloseDeleteModal}
          onConfirmDelete={handleConfirmDelete}
          itemToDeleteName={itemToDelete?.name || ""}
          isStoreClosedModalOpen={isStoreClosedModalOpen}
          onCloseStoreModal={handleCloseStoreModal}
          storeClosedMessage={storeStatus.message}
          opensAt={storeStatus.opensAt}
        />
      </div>
    </form>
  );
}