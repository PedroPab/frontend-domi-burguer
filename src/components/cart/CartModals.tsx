"use client";
import { CustomizationModalCart } from "@/components/cart/customizationModalCart";
import { ConfirmDeleteModal } from "@/components/cart/confirmDeleteModal";
import { StoreClosedModal } from "@/components/cart/storeClosedModal";
import { useCartActions } from "@/hooks/cart/useCartActions";
import { useComplementsModal } from "@/hooks/cart/useComplementsModal";
import { useCartSubmit } from "@/hooks/cart/useCartSubmit";

export function CartModals() {
    const {
        handleConfirmDelete,
        handleCloseDeleteModal,
        itemToDelete,
        isDeleteModalOpen,
    } = useCartActions();

    const {
        isModalComplementsOpen,
        selectedCartItem,
        handleCloseComplementsModal,
    } = useComplementsModal();

    const {
        storeStatus,
        isStoreClosedModalOpen,
        handleCloseStoreModal,
    } = useCartSubmit();


    return (
        <>
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
                productName={itemToDelete?.name ?? ""}
            />

            <StoreClosedModal
                isOpen={isStoreClosedModalOpen}
                onClose={handleCloseStoreModal}
                message={storeStatus?.message ?? ""}
                opensAt={storeStatus?.opensAt ?? undefined}
            />
        </>
    );
}