"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { Modal } from "../Modal";
import type { ModalProps } from "../types";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertModalProps extends Omit<ModalProps, "variant" | "footer" | "children"> {
  /** Tipo de alerta */
  type?: AlertType;
  /** Mensaje principal */
  message: string;
  /** Texto del boton de confirmacion */
  confirmText?: string;
  /** Contenido adicional debajo del mensaje */
  children?: React.ReactNode;
}

const alertIcons: Record<AlertType, React.ReactNode> = {
  info: <Info className="h-8 w-8 text-blue-500" />,
  success: <CheckCircle className="h-8 w-8 text-green-500" />,
  warning: <AlertTriangle className="h-8 w-8 text-accent-yellow-80" />,
  error: <XCircle className="h-8 w-8 text-red-500" />,
};

export function AlertModal({
  type = "info",
  message,
  confirmText = "ENTENDIDO",
  onOpenChange,
  children,
  headerIcon,
  ...props
}: AlertModalProps) {
  return (
    <Modal
      variant="alert"
      size="sm"
      headerIcon={headerIcon || alertIcons[type]}
      footer={{
        confirm: {
          label: confirmText,
          onClick: () => onOpenChange(false),
        },
        cancel: false,
        alignment: "center",
      }}
      onOpenChange={onOpenChange}
      {...props}
    >
      <p className="text-center text-neutral-black-80">{message}</p>
      {children}
    </Modal>
  );
}
