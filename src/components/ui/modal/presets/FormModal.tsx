"use client";

import * as React from "react";
import { Modal } from "../Modal";
import type { ModalProps } from "../types";

interface FormModalProps extends Omit<ModalProps, "variant" | "footer"> {
  /** Callback al enviar el formulario */
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  /** Texto del boton de cancelar */
  cancelText?: string;
  /** Texto del boton de enviar */
  submitText?: string;
  /** Estado de carga */
  loading?: boolean;
  /** Deshabilitar envio */
  submitDisabled?: boolean;
}

export function FormModal({
  onSubmit,
  cancelText = "CANCELAR",
  submitText = "GUARDAR",
  loading = false,
  submitDisabled = false,
  children,
  onOpenChange,
  ...props
}: FormModalProps) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  const handleConfirmClick = () => {
    // Trigger form submit via ref
    formRef.current?.requestSubmit();
  };

  return (
    <Modal
      variant="form"
      size="lg"
      footer={{
        cancel: {
          label: cancelText,
          type: "button",
        },
        confirm: {
          label: submitText,
          type: "button",
          onClick: handleConfirmClick,
          loading,
          loadingText: "Guardando...",
          disabled: submitDisabled,
        },
        alignment: "end",
      }}
      onOpenChange={onOpenChange}
      {...props}
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
        {children}
      </form>
    </Modal>
  );
}
