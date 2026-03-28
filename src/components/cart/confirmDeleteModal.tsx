"use client";

import React from "react";
import { ConfirmModal } from "@/components/ui/modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  return (
    <ConfirmModal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="¿ELIMINAR ESTE PRODUCTO DEL PEDIDO?"
      message="¿Seguro que no quieres pensarlo dos veces?"
      cancelText="NO, DÉJALO"
      confirmText="SI, ELIMINAR"
      onConfirm={onConfirm}
    />
  );
};
