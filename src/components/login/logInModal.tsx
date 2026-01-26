"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginSection } from "./loginSection";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogInModal = ({ isOpen, onClose }: ModalProps) => {
  useEffect(() => {
    const handlePopState = () => onClose();

    if (isOpen) {
      window.history.pushState({ modalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (!isOpen && window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenChange={onClose}
        aria-describedby="Iniciar sesión"
        onInteractOutside={(event) => {
          // evita cerrar si el click viene del contenedor de Google
          if (
            event.target instanceof HTMLElement &&
            event.target.closest(".pac-container")
          ) {
            event.preventDefault();
          }
        }}
        className="flex-col flex bg-background sm:top-105 p-4 lg:p-6 rounded-2xl lg:w-[820px] h-[600px] z-600"
      >
        <LoginSection onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
