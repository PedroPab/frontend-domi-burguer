import React from "react";
import { CustomizationModalCart } from "@/components/cart/customizationModalCart";
import { ConfirmDeleteModal } from "@/components/cart/confirmDeleteModal";
import { StoreClosedModal } from "@/components/cart/storeClosedModal";
import { CartItem } from "@/store/cartStore";

interface CartModalsProps {
    // Complements Modal
    isComplementsModalOpen: boolean;
    onCloseComplementsModal: () => void;
    selectedCartItem: CartItem | null;

    // Delete Modal
    isDeleteModalOpen: boolean;
    onCloseDeleteModal: () => void;
    onConfirmDelete: () => void;
    itemToDeleteName: string;

    // Store Closed Modal
    isStoreClosedModalOpen: boolean;
    onCloseStoreModal: () => void;
    storeClosedMessage: string;
    opensAt: string | null;
}

export function CartModals({

    isComplementsModalOpen,
    onCloseComplementsModal,
    selectedCartItem,
    isDeleteModalOpen,
    onCloseDeleteModal,
    onConfirmDelete,
    itemToDeleteName,
    isStoreClosedModalOpen,
    onCloseStoreModal,
    storeClosedMessage,
    opensAt,
}: CartModalsProps) {
    return (
        <>


            {selectedCartItem && (
                <CustomizationModalCart
                    isOpen={isComplementsModalOpen}
                    onClose={onCloseComplementsModal}
                    cartItem={selectedCartItem}
                />
            )}

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={onCloseDeleteModal}
                onConfirm={onConfirmDelete}
                productName={itemToDeleteName}
            />

            <StoreClosedModal
                isOpen={isStoreClosedModalOpen}
                onClose={onCloseStoreModal}
                message={storeClosedMessage}
                opensAt={opensAt}
            />
        </>
    );
}