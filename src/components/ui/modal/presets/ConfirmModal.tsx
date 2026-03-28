"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Modal } from "../Modal";
import type { ModalProps } from "../types";

interface ConfirmModalProps extends Omit<ModalProps, "variant" | "footer" | "children"> {
  /** Mensaje de confirmacion */
  message: string;
  /** Texto del boton de cancelar */
  cancelText?: string;
  /** Texto del boton de confirmar */
  confirmText?: string;
  /** Callback al confirmar */
  onConfirm: () => void | Promise<void>;
  /** Variante destructiva (boton rojo) */
  destructive?: boolean;
  /** Estado de carga */
  loading?: boolean;
  /** Contenido adicional */
  children?: React.ReactNode;
}

export function ConfirmModal({
  message,
  cancelText = "CANCELAR",
  confirmText = "CONFIRMAR",
  onConfirm,
  onOpenChange,
  destructive = false,
  loading = false,
  children,
  headerIcon,
  ...props
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Modal
      variant="confirm"
      size="sm"
      headerIcon={headerIcon || <HelpCircle className="h-8 w-8 text-accent-yellow-80" />}
      footer={{
        cancel: {
          label: cancelText,
        },
        confirm: {
          label: confirmText,
          variant: destructive ? "destructive" : "default",
          onClick: handleConfirm,
          loading,
          loadingText: "Procesando...",
        },
        alignment: "center",
      }}
      onOpenChange={onOpenChange}
      {...props}
    >
      <p className="text-center text-neutral-black-60">{message}</p>
      {children}
    </Modal>
  );
}
